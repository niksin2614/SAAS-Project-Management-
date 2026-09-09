"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SYNCD-${randomStr}`;
}

/**
 * Get or generate a unique organization invite code & share link
 */
export async function getOrCreateOrgInviteCode(organizationId, orgName) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!organizationId) {
    throw new Error("Organization ID required");
  }

  let invite = await db.organizationInvite.findUnique({
    where: { organizationId },
  });

  if (!invite) {
    let uniqueCode = generateCode();
    // Ensure uniqueness
    let exists = await db.organizationInvite.findUnique({ where: { code: uniqueCode } });
    while (exists) {
      uniqueCode = generateCode();
      exists = await db.organizationInvite.findUnique({ where: { code: uniqueCode } });
    }

    invite = await db.organizationInvite.create({
      data: {
        code: uniqueCode,
        organizationId,
        orgName: orgName || "Organization",
        createdBy: userId,
      },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${appUrl}/onboarding?code=${invite.code}`;

  return {
    code: invite.code,
    orgName: invite.orgName,
    inviteUrl,
  };
}

/**
 * Regenerate a new code for the organization (Admins only)
 */
export async function regenerateOrgInviteCode(organizationId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify Admin role in Clerk
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId,
    });

  const userMembership = membershipList.find(
    (m) => m.publicUserData?.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization Admins can regenerate the invite code");
  }

  let uniqueCode = generateCode();
  let exists = await db.organizationInvite.findUnique({ where: { code: uniqueCode } });
  while (exists) {
    uniqueCode = generateCode();
    exists = await db.organizationInvite.findUnique({ where: { code: uniqueCode } });
  }

  const invite = await db.organizationInvite.upsert({
    where: { organizationId },
    update: { code: uniqueCode },
    create: {
      code: uniqueCode,
      organizationId,
      orgName: "Organization",
      createdBy: userId,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    code: invite.code,
    inviteUrl: `${appUrl}/onboarding?code=${invite.code}`,
  };
}

/**
 * Join an organization using an invite code (Instant enrollment as Member)
 */
export async function joinOrganizationWithCode(code) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Please log in first to join an organization");
  }

  if (!code) {
    throw new Error("Please enter a valid invite code");
  }

  const normalizedCode = code.trim().toUpperCase();

  const invite = await db.organizationInvite.findUnique({
    where: { code: normalizedCode },
  });

  if (!invite) {
    throw new Error("Invalid or expired invite code. Please ask your admin for the latest code.");
  }

  // Ensure user is recorded in the PostgreSQL database
  let user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    user = await checkUser();
  }

  // Add user to the Clerk organization as a member
  try {
    await clerkClient().organizations.createOrganizationMembership({
      organizationId: invite.organizationId,
      userId: userId,
      role: "org:member",
    });
  } catch (clerkErr) {
    // If user is already a member, continue smoothly
    const errMessage = clerkErr?.errors?.[0]?.message || clerkErr.message || "";
    if (
      !errMessage.toLowerCase().includes("already") &&
      !errMessage.toLowerCase().includes("exists")
    ) {
      console.error("Clerk membership error:", clerkErr);
      throw new Error(errMessage || "Failed to join organization in Clerk");
    }
  }

  return {
    success: true,
    organizationId: invite.organizationId,
    orgName: invite.orgName,
  };
}
