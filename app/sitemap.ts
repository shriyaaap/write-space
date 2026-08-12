import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const articleUrls = articles.map((article) => ({
    url: `http://localhost:3000/articles/${article.slug}`,
    lastModified: article.updatedAt,
  }));

  return [
    {
      url: "http://localhost:3000",
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}