"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { Prisma } from "../generated/prisma/client";

export async function clapArticle(articleId: string) {
  const userId = await getSessionUserId();

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to clap.",
    };
  }

  const article = await prisma.article.findFirst({
    where: {
      id: articleId,
      status: "PUBLISHED",
    },
  });

  if (!article) {
    return {
      success: false,
      error: "Article not found.",
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

  try {
    await prisma.clap.create({
      data: {
        userId,
        articleId,
        count: 1,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "You have already clapped for this article.",
      };
    }

    throw error;
  }

  return {
    success: true,
  };
}