import { prisma } from "../db/prisma";

const publicAuthorSelect = {
  id: true,
  name: true,
  username: true,
  avatar: true,
};

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
      author: {
        select: publicAuthorSelect,
      },
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
      author: {
        select: publicAuthorSelect,
      },
      tags: true,
      claps: true,
      comments: {
        include: {
          author: {
            select: publicAuthorSelect,
          },
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


export async function searchPublishedArticles(
  query: string,
  page: number = 1
) {
  const search = query.trim();

  if (!search) {
    return {
      articles: [],
      total: 0,
    };
  }

  const pageSize = 10;
  const safePage = Math.max(page, 1);

  const where = {
    status: "PUBLISHED" as const,
    title: {
      contains: search,
      mode: "insensitive" as const,
    },
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      skip: (safePage - 1) * pageSize,
      take: pageSize,
      include: {
        author: {
          select: publicAuthorSelect,
        },
        tags: true,
      },
    }),

    prisma.article.count({
      where,
    }),
  ]);

  console.log(
    "SEARCH:",
    search,
    "PAGE:",
    safePage,
    "RESULT TITLES:",
    articles.map((article) => article.title)
  );

  return {
    articles,
    total,
  };
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
    take: 10,
    include: {
      author: {
        select: publicAuthorSelect,
      },
      tags: true,
    },
  });
}

export async function getFollowingAuthors(userId: string) {
  const follows = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return follows.map((follow) => follow.following);
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
          author: {
            select: publicAuthorSelect,
          },
          tags: true,
        },
      },

      _count: {
        select: {
          articles: true,
          followers: true,
          following: true,
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
    take: 20,
    include: {
      author: {
        select: publicAuthorSelect,
      },
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