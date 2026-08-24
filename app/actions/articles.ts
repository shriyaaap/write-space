"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { z } from "zod";

const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),
});

type ActionState = {
  error?: string;
};

function createSlug(title: string) {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${Date.now()}`;
}


/* -----------------------------
   Create Draft
----------------------------- */

export async function createDraft(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const result = articleSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const { title, description, content } = result.data;

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


/* -----------------------------
   Update Draft
----------------------------- */

export async function updateDraft(
  prevState: ActionState | null,
  formData: FormData
) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const id = formData.get("id")?.toString();

  if (!id) {
    return {
      error: "Article ID is missing.",
    };
  }

  const result = articleSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const article = await prisma.article.findFirst({
    where: {
      id,
      authorId: userId,
      status: {
        in: ["DRAFT", "SCHEDULED"],
      },
    },
  });

  if (!article) {
    return {
      error: "Article not found.",
    };
  }

  await prisma.article.update({
    where: {
      id: article.id,
    },
    data: {
      title: result.data.title,
      description: result.data.description,
      content: result.data.content,
      status: "DRAFT",
      scheduledAt: null,
    },
  });

  redirect("/dashboard");
}


/* -----------------------------
   Publish Article
----------------------------- */

export async function publishArticle(
  prevState: ActionState | null,
  formData: FormData
) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const result = articleSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const { title, description, content } = result.data;

  const id = formData.get("id")?.toString();

  // EDIT EXISTING ARTICLE
  if (id) {
    const article = await prisma.article.findFirst({
      where: {
        id,
        authorId: userId,
        status: {
          in: ["DRAFT", "SCHEDULED"],
        },
      },
    });

    if (!article) {
      return {
        error: "Article not found.",
      };
    }

    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        title,
        description,
        content,
        status: "PUBLISHED",
        publishedAt: new Date(),
        scheduledAt: null,
      },
    });
  }

  // CREATE NEW ARTICLE
  else {
    await prisma.article.create({
      data: {
        title,
        description,
        content,
        slug: createSlug(title),
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: userId,
      },
    });
  }

  redirect("/dashboard");
}


/* -----------------------------
   Schedule Article
----------------------------- */

export async function scheduleArticle(
  prevState: ActionState | null,
  formData: FormData
) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const result = articleSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const scheduledAtValue =
    formData.get("scheduledAt")?.toString() ?? "";

  if (!scheduledAtValue) {
    return {
      error: "Please select a schedule date.",
    };
  }

  const scheduledAt = new Date(scheduledAtValue);

  if (
    Number.isNaN(scheduledAt.getTime()) ||
    scheduledAt <= new Date()
  ) {
    return {
      error: "Please select a future date and time.",
    };
  }

  const { title, description, content } = result.data;

  const id = formData.get("id")?.toString();

  // EDIT EXISTING ARTICLE
  if (id) {
    const article = await prisma.article.findFirst({
      where: {
        id,
        authorId: userId,
        status: {
          in: ["DRAFT", "SCHEDULED"],
        },
      },
    });

    if (!article) {
      return {
        error: "Article not found.",
      };
    }

    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        title,
        description,
        content,
        status: "SCHEDULED",
        scheduledAt,
        publishedAt: null,
      },
    });
  }

  // CREATE NEW ARTICLE
  else {
    await prisma.article.create({
      data: {
        title,
        description,
        content,
        slug: createSlug(title),
        status: "SCHEDULED",
        scheduledAt,
        authorId: userId,
      },
    });
  }

  redirect("/dashboard");
}

/* -----------------------------
   Publish Scheduled Articles
----------------------------- */

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


/* -----------------------------
   Delete Article
----------------------------- */

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


/* -----------------------------
   Record Article View
----------------------------- */

export async function recordArticleView(articleId: string) {
  console.log("Recording view for:", articleId);

  const article = await prisma.article.update({
    where: {
      id: articleId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  console.log("New view count:", article.views);

  return article.views;
}

