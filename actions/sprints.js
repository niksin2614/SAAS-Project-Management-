"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { sendSprintStartedEmail } from "@/lib/email";

export async function createSprint(projectId, data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify user is an admin of the project's organization
  if (project.organizationId) {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only organization Admins can create sprints");
    }
  }

  // Determine unique sprint name within project
  let sprintName = data.name;
  if (!sprintName) {
    const existingCount = await db.sprint.count({ where: { projectId } });
    sprintName = `${project.key}-${existingCount + 1}`;
  }

  // If a sprint with this name already exists in this project, auto-increment suffix
  let candidateName = sprintName;
  let counter = 1;
  while (await db.sprint.findFirst({ where: { projectId, name: candidateName } })) {
    candidateName = `${sprintName}-${counter}`;
    counter++;
  }

  const sprint = await db.sprint.create({
    data: {
      name: candidateName,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId: projectId,
    },
  });

  return sprint;
}

export async function updateSprintStatus(sprintId, newStatus) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // Verify user is an admin of the project's organization
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: sprint.project.organizationId,
      });

    const userMembership = membershipList.find(
      (membership) => membership.publicUserData.userId === userId
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only organization Admins can start or complete sprints");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    // If sprint is started, send notification email to all organization members
    if (newStatus === "ACTIVE") {
      try {
        const memberUserIds = membershipList.map(
          (m) => m.publicUserData.userId
        );
        const members = await db.user.findMany({
          where: { clerkUserId: { in: memberUserIds } },
        });
        const emails = members.map((m) => m.email).filter(Boolean);

        await sendSprintStartedEmail({
          toList: emails,
          sprintName: sprint.name,
          projectName: sprint.project.name,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          sprintUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project/${sprint.projectId}`,
        });
      } catch (emailErr) {
        console.error("Failed to send sprint email:", emailErr);
      }
    }

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error.message);
  }
}
