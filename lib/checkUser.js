import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.username ||
      "User";

    const loggedInUser = await db?.user.findFirst({
      where: {
        OR: [
          { clerkUserId: user.id },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (loggedInUser) {
      if (
        loggedInUser.clerkUserId !== user.id ||
        loggedInUser.imageUrl !== user.imageUrl ||
        loggedInUser.name !== name
      ) {
        return await db.user.update({
          where: { id: loggedInUser.id },
          data: {
            clerkUserId: user.id,
            name: name || loggedInUser.name,
            imageUrl: user.imageUrl || loggedInUser.imageUrl,
          },
        });
      }
      return loggedInUser;
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: email || `${user.id}@syncd.local`,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
