"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { Prisma } from "../generated/prisma/client";
import { z } from "zod";

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

  const targetUser = await prisma.user.findUnique({
    where: {
      id: followingId,
    },
    select: {
      id: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      error: "User not found.",
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

  try {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "You are already following this user.",
      };
    }

    throw error;
  }

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

  const idResult = z.string().cuid().safeParse(followingId);

  if (!idResult.success) {
    return {
      success: false,
      error: "Invalid user ID.",
    };
  }

  await prisma.follow.deleteMany({
    where: {
      followerId,
      followingId: idResult.data,
    },
  });

  return {
    success: true,
  };
}