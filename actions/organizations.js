"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";

export async function getOrganization(slug) {
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

  // Get the organization details by slug or by organizationId
  let organization = null;
  try {
    organization = await clerkClient().organizations.getOrganization({
      slug,
    });
  } catch (err) {
    try {
      organization = await clerkClient().organizations.getOrganization({
        organizationId: slug,
      });
    } catch (e) {
      return null;
    }
  }

  if (!organization) {
    return null;
  }

  // Check if user belongs to this organization
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId
  );

  // If user is not a member, return null
  if (!userMembership) {
    return null;
  }

  return organization;
}

export async function getProjects(orgId) {
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

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function getUserIssues(userId, orgIdParam) {
  const { orgId: authOrgId } = auth();
  const orgId = orgIdParam || authOrgId;

  if (!userId || !orgId) {
    return [];
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

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { reporterId: user.id }],
      project: {
        organizationId: orgId,
      },
    },
    include: {
      project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return issues;
}

export async function getOrganizationUsers(orgId) {
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

  const organizationMemberships =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership.publicUserData.userId
  );

  let users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  if (users.length === 0 && user) {
    users = [user];
  }

  return users;
}
