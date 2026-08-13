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
      claps: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function isFollowingUser(
  followerId: string,
  followingId: string
) {
  return prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
}

export async function searchPublishedArticles(query: string) {
  const search = query.trim();

  if (!search) {
    return [];
  }

  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
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

export async function getFollowingArticles(userId: string) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      author: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
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