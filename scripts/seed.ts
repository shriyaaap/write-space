import "dotenv/config";

import { getDevToArticles } from "../lib/devto/list";
import { getDevToArticle } from "../lib/devto/client";
import { prisma } from "../lib/db/prisma";

async function main() {
  console.log(
    "DATABASE HOST:",
    process.env.DATABASE_URL
      ? new URL(process.env.DATABASE_URL).hostname
      : "MISSING"
  );

  console.log("Starting Dev.to import...\n");

  let totalArticles = 0;
  let successfulArticles = 0;
  let failedArticles = 0;

  // Import pages 1, 2 and 3
  for (let page = 1; page <= 3; page++) {
    console.log(`\n========== PAGE ${page} ==========\n`);

    const articles = await getDevToArticles(page);

    console.log(`Found ${articles.length} articles on page ${page}`);

    for (const devArticle of articles) {
      totalArticles++;

      try {
        console.log(
          `\n[${totalArticles}] Fetching: ${devArticle.title}`
        );

        // Fetch the full article to get body_markdown
        const fullArticle = await getDevToArticle(devArticle.id);

        // Skip articles without markdown content
        if (!fullArticle.body_markdown) {
          console.log("Skipping article: no markdown content");
          failedArticles++;
          continue;
        }

        // --------------------------------
        // 1. CREATE / FIND AUTHOR
        // --------------------------------

        const user = await prisma.user.upsert({
          where: {
            username: devArticle.user.username,
          },
          update: {
            name: devArticle.user.name,
            bio: null,
            avatar: devArticle.user.profile_image,
          },
          create: {
            username: devArticle.user.username,
            name: devArticle.user.name,
            email: `${devArticle.user.user_id}@devto.import`,
            password: "devto-import",
            bio: null,
            avatar: devArticle.user.profile_image,
          },
        });

        // --------------------------------
        // 2. CREATE / FIND TAGS
        // --------------------------------

        const tags = [];

        for (const tagName of devArticle.tag_list) {
          const tag = await prisma.tag.upsert({
            where: {
              name: tagName,
            },
            update: {},
            create: {
              name: tagName,
            },
          });

          tags.push(tag);
        }

        // --------------------------------
        // 3. CREATE / UPDATE ARTICLE
        // --------------------------------

        await prisma.article.upsert({
          where: {
            slug: fullArticle.slug,
          },

          update: {
            title: fullArticle.title,
            description: fullArticle.description,
            content: fullArticle.body_markdown,
            coverImage: fullArticle.cover_image,
            publishedAt: fullArticle.published_at
              ? new Date(fullArticle.published_at)
              : null,

            tags: {
              set: tags.map((tag) => ({
                id: tag.id,
              })),
            },
          },

          create: {
            title: fullArticle.title,
            slug: fullArticle.slug,
            description: fullArticle.description,
            content: fullArticle.body_markdown,
            coverImage: fullArticle.cover_image,

            status: "PUBLISHED",

            publishedAt: fullArticle.published_at
              ? new Date(fullArticle.published_at)
              : null,

            authorId: user.id,

            tags: {
              connect: tags.map((tag) => ({
                id: tag.id,
              })),
            },
          },
        });

        successfulArticles++;

        console.log(
          `✓ Imported: ${fullArticle.title}`
        );
      } catch (error) {
        failedArticles++;

        console.error(
          `✗ Failed to import article ${devArticle.id}`
        );

        console.error(error);
      }
    }
  }

  // --------------------------------
  // FINAL SUMMARY
  // --------------------------------

  console.log("\n================================");
  console.log("DEV.TO IMPORT COMPLETE");
  console.log("================================");

  console.log(`Total articles processed: ${totalArticles}`);
  console.log(`Successfully imported: ${successfulArticles}`);
  console.log(`Failed: ${failedArticles}`);

  console.log("================================\n");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });