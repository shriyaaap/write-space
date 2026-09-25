"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {z} from "zod"

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
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return {
    success: true,
    comment,
  };
}

export async function deleteComment(commentId: string) {
  const idResult = z.string().cuid().safeParse(commentId);

  if (!idResult.success) {
    return {
      success: false,
      error: "Invalid comment ID.",
    };
  }

  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const validCommentId = idResult.data;

  const comment = await prisma.comment.findUnique({
    where: {
      id: validCommentId,
    },
    include: {
      article: true,
    },
  });

  if (!comment) {
    return {
      success: false,
      error: "Comment not found.",
    };
  }

  if (
    comment.authorId !== userId &&
    comment.article.authorId !== userId
  ) {
    return {
      success: false,
      error: "You are not allowed to delete this comment.",
    };
  }

  await prisma.comment.delete({
    where: {
      id: validCommentId,
    },
  });

  return {
    success: true,
  };
}