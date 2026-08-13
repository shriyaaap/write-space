"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";

export async function clapArticle(articleId: string) {
  const userId = await getSessionUserId();

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to clap.",
    };
  }

  const existingClap = await prisma.clap.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (existingClap) {
    return {
      success: false,
      error: "You have already clapped for this article.",
    };
  }

  await prisma.clap.create({
    data: {
      userId,
      articleId,
      count: 1,
    },
  });

  return {
    success: true,
  };
}