"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";

export async function getOrganizationMessages(orgId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    return [];
  }

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    user = await checkUser();
  }

  const messages = await db.chatMessage.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
          email: true,
        },
      },
    },
    take: 100,
  });

  return messages;
}

export async function sendOrganizationMessage(orgId, content) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("Organization ID required");
  }

  const trimmed = content ? content.trim() : "";
  if (!trimmed) {
    throw new Error("Message cannot be empty");
  }

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    user = await checkUser();
  }

  if (!user) {
    throw new Error("User record not found");
  }

  // Determine user's role in this organization
  let senderRole = "org:member";
  try {
    const { data: membershipList } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    const userMembership = membershipList.find(
      (m) => m.publicUserData?.userId === userId
    );

    if (userMembership?.role === "org:admin") {
      senderRole = "org:admin";
    }
  } catch (err) {
    console.error("Error fetching organization membership for chat:", err);
  }

  const message = await db.chatMessage.create({
    data: {
      content: trimmed,
      organizationId: orgId,
      senderId: user.id,
      senderRole: senderRole,
    },
    include: {
      sender: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
          email: true,
        },
      },
    },
  });

  return message;
}

export async function deleteChatMessage(messageId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const message = await db.chatMessage.findUnique({
    where: { id: messageId },
    include: { sender: true },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  // Check if sender is current user or admin
  let isAuthorized = message.sender.clerkUserId === userId;

  if (!isAuthorized && message.organizationId) {
    try {
      const { data: membershipList } =
        await clerkClient().organizations.getOrganizationMembershipList({
          organizationId: message.organizationId,
        });

      const userMembership = membershipList.find(
        (m) => m.publicUserData?.userId === userId
      );

      isAuthorized = userMembership?.role === "org:admin";
    } catch (err) {
      console.error("Error checking admin status for chat deletion:", err);
    }
  }

  if (!isAuthorized) {
    throw new Error("Only the message author or organization admin can delete this message");
  }

  await db.chatMessage.delete({
    where: { id: messageId },
  });

  return { success: true, messageId };
}
