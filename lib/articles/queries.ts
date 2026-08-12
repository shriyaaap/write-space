import { prisma } from "../db/prisma";

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      author: true,
      tags: true,
    },
  });
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      author: true,
      tags: true,
    },
  });
}