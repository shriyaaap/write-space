"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";

export async function followUser(followingId: string) {
  const followerId = await getSessionUserId();

  if (!followerId) {
    return {
      success: false,
      error: "You must be logged in to follow users.",
    };
  }

  if (followerId === followingId) {
    return {
      success: false,
      error: "You cannot follow yourself.",
    };
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    return {
      success: false,
      error: "You are already following this user.",
    };
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return {
    success: true,
  };
}

export async function unfollowUser(followingId: string) {
  const followerId = await getSessionUserId();

  if (!followerId) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  await prisma.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });

  return {
    success: true,
  };
}