import { getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import NavigationClient from "./NavigationClient";

export default async function Navigation() {
  const userId = await getSessionUserId();

  let username: string | null = null;
  let avatar: string | null = null;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        avatar: true,
      },
    });

    username = user?.username ?? null;
    avatar = user?.avatar ?? null;
  }

  return (
    <NavigationClient
      userId={userId}
      username={username}
      avatar={avatar}
    />
  );
}