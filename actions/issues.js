"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { checkUser } from "@/lib/checkUser";
import { clerkClient } from "@clerk/nextjs/server";
import { sendTaskAssignedEmail } from "@/lib/email";

export async function getIssuesForSprint(sprintId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

export async function createIssue(projectId, data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    user = await checkUser();
  }

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description || "",
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId || null,
      reporterId: user.id,
      assigneeId: data.assigneeId && data.assigneeId.length > 0 ? data.assigneeId : user.id,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
      project: true,
    },
  });

  // Send email notification to assignee
  if (issue.assignee?.email) {
    try {
      await sendTaskAssignedEmail({
        to: issue.assignee.email,
        recipientName: issue.assignee.name || "Team Member",
        taskTitle: issue.title,
        projectName: issue.project?.name || "Project",
        priority: issue.priority,
        reporterName: user.name || "Team Member",
        taskUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project/${projectId}`,
      });
    } catch (emailErr) {
      console.error("Failed to send task assignment email:", emailErr);
    }
  }

  return issue;
}

export async function updateIssueOrder(updatedIssues) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!updatedIssues || updatedIssues.length === 0) {
    return { success: true };
  }

  // Get project from the first issue to verify admin privileges
  const firstIssue = await db.issue.findUnique({
    where: { id: updatedIssues[0].id },
    include: { project: true },
  });

  if (firstIssue?.project?.organizationId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: firstIssue.project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only Organization Admins can change task status and order");
    }
  }

  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update each issue
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    user = await checkUser();
  }

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  // Check if user is reporter or org admin
  let isAuthorized = issue.reporterId === user.id;
  if (!isAuthorized && issue.project?.organizationId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: issue.project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    isAuthorized = userMembership?.role === "org:admin";
  }

  if (!isAuthorized) {
    throw new Error("Only the reporter or organization admin can delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

export async function updateIssue(issueId, data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    // If status is being changed, enforce Admin role
    if (data.status && data.status !== issue.status && issue.project?.organizationId) {
      const { data: membershipList } =
        await clerkClient().organizations.getOrganizationMembershipList({
          organizationId: issue.project.organizationId,
        });

      const userMembership = membershipList.find(
        (membership) => membership.publicUserData.userId === userId
      );

      if (!userMembership || userMembership.role !== "org:admin") {
        throw new Error("Only Organization Admins can change task status");
      }
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    throw new Error("Error updating issue: " + error.message);
  }
}
