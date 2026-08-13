"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";

export async function createComment(
  articleId: string,
  content: string
) {
  const userId = await getSessionUserId();

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to comment.",
    };
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return {
      success: false,
      error: "Comment cannot be empty.",
    };
  }

  if (trimmedContent.length > 1000) {
    return {
      success: false,
      error: "Comment must be 1000 characters or less.",
    };
  }

  const comment = await prisma.comment.create({
    data: {
      content: trimmedContent,
      articleId,
      authorId: userId,
    },
    include: {
      author: true,
    },
  });

  return {
    success: true,
    comment,
  };
}