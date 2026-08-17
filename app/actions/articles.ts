"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";

export async function createDraft(formData: FormData) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const title = formData.get("title")?.toString().trim() || "";
  const description =
    formData.get("description")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim() || "";

  if (!title) {
    return;
  }

  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${Date.now()}`;

  await prisma.article.create({
    data: {
      title,
      slug,
      description,
      content,
      status: "DRAFT",
      authorId: userId,
    },
  });

  redirect("/dashboard");
}

export async function updateDraft(formData: FormData) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const id = formData.get("id")?.toString();

  const title = formData.get("title")?.toString().trim() || "";

  const description =
    formData.get("description")?.toString().trim() || "";

  const content =
    formData.get("content")?.toString().trim() || "";

  if (!id || !title || !content) {
    return;
  }

  const article = await prisma.article.findFirst({
    where: {
      id,
      authorId: userId,
      status: "DRAFT",
    },
  });

  if (!article) {
    return;
  }

  await prisma.article.update({
    where: {
      id: article.id,
    },
    data: {
      title,
      description,
      content,
    },
  });

  redirect("/dashboard");
}

export async function publishArticle(formData: FormData) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const title = formData.get("title")?.toString().trim() || "";
  const description =
    formData.get("description")?.toString().trim() || "";
  const content =
    formData.get("content")?.toString().trim() || "";

  if (!title || !content) {
    return;
  }

  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${Date.now()}`;

  await prisma.article.create({
    data: {
      title,
      slug,
      description,
      content,
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: userId,
    },
  });

  redirect("/dashboard");
}

export async function scheduleArticle(formData: FormData) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const title = formData.get("title")?.toString().trim() || "";
  const description =
    formData.get("description")?.toString().trim() || "";
  const content =
    formData.get("content")?.toString().trim() || "";
  const scheduledAtValue =
    formData.get("scheduledAt")?.toString() || "";

  if (!title || !content || !scheduledAtValue) {
    return;
  }

  const scheduledAt = new Date(scheduledAtValue);

  if (Number.isNaN(scheduledAt.getTime())) {
    return;
  }

  if (scheduledAt <= new Date()) {
    return;
  }

  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${Date.now()}`;

  await prisma.article.create({
    data: {
      title,
      slug,
      description,
      content,
      status: "SCHEDULED",
      scheduledAt,
      authorId: userId,
    },
  });

  redirect("/dashboard");
}

export async function publishScheduledArticles() {
  const now = new Date();

  const scheduledArticles = await prisma.article.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: {
        lte: now,
      },
    },
  });

  if (scheduledArticles.length === 0) {
    return;
  }

  await prisma.article.updateMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: {
        lte: now,
      },
    },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
    },
  });
}

export async function deleteArticle(formData: FormData) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const articleId = formData.get("articleId")?.toString();

  if (!articleId) {
    return;
  }

  const article = await prisma.article.findFirst({
    where: {
      id: articleId,
      authorId: userId,
    },
  });

  if (!article) {
    return;
  }

  await prisma.article.delete({
    where: {
      id: article.id,
    },
  });

  redirect("/dashboard");
}

export async function recordArticleView(articleId: string) {
  await prisma.article.update({
    where: {
      id: articleId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}