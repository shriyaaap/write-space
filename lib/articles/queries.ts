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