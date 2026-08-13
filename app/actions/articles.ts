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