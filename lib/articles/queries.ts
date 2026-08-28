import { prisma } from "../db/prisma";

export async function getPublishedArticles(
  page = 1,
  pageSize = 10
) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
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

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      title: {
        contains: search,
        mode: "insensitive",
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

  console.log(
    "SEARCH:",
    search,
    "RESULT TITLES:",
    articles.map((article) => article.title)
  );

  return articles;
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

export async function getAuthorByUsername(username: string) {
  return prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      articles: {
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
      },
    },
  });
}

export async function getArticlesByTag(tag: string) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      tags: {
        some: {
          name: tag,
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

export async function searchUsers(query: string) {
  const search = query.trim();

  if (!search) {
    return [];
  }

  return prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
    take: 10,
  });
}