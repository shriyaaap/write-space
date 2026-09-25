/* eslint-disable @next/next/no-img-element */

import { getPublishedArticles } from "@/lib/articles/queries";
import { getSessionUserId } from "@/lib/auth/session";
import ArticleCard from "@/components/articles/ArticleCard";
import Link from "next/link";
import styles from "./Home.module.css";

type HomePageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Home({
  searchParams,
}: HomePageProps) {
  const userId = await getSessionUserId();

  // Unauthenticated landing page
  if (!userId) {
    return (
      <main className="landing-container">
        <section className="full-page-hero">
          <div className="hero-content">
            <h1 className="hero-quote">
              Create, Share
              <br />
              & Inspire.
            </h1>

            <p className="hero-subtext">
              A place to read, write, and share your ideas.
            </p>

            <Link href="/login" className="hero-btn-primary">
              Start writing
            </Link>
          </div>

          <div className="hero-art">
            <img
              src="/images/write-space-hero.png"
              alt=""
            />
          </div>
        </section>
      </main>
    );
  }

  const params = await searchParams;
  const requestedPage = Number(params.page) || 1;
  const page = Math.min(Math.max(requestedPage, 1), 3);

  const articles = await getPublishedArticles(page, 10);

  const recentArticles = articles.slice(1);

  return (
    <main className={styles.home}>
      <div className={styles.content}>

        {/* Editorial navigation */}
        

        {/* Main content + right sidebar */}
        <div className={styles.homeGrid}>

          {/* Main feed */}
          <section className={styles.feed}>

            <div className={styles.recentHeader}>
              <h2>Recent Chronicles</h2>
            </div>

            <div className={styles.articleList}>
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className={styles.articleWrapper}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              {page > 1 && (
                <Link href={`/?page=${page - 1}`}>
                  ← Previous
                </Link>
              )}

              <span>
                Page {page} of 3
              </span>

              {page < 3 && (
                <Link href={`/?page=${page + 1}`}>
                  Next →
                </Link>
              )}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className={styles.sidebar}>

            {/* From this week's stories */}
            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <span>▱</span>
                <h2>From the Feed</h2>
              </div>

              {articles.slice(0, 3).map((article, index) => (
                <div
                  className={styles.ledgerItem}
                  key={article.id}
                >
                  <span
                    className={styles.blueDot}
                  >
                    ●
                  </span>

                  <div>
                    <small>
                      {index === 0
                        ? "LATEST"
                        : index === 1
                        ? "READ NEXT"
                        : "FEATURED"}
                    </small>

                    <h3>{article.title}</h3>

                    <p>
                      By {article.author.name}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/search"
                className={styles.exploreLink}
              >
                Discover more stories →
              </Link>
            </section>

            {/* Writers */}
            <section className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>
                Writers in Your Feed
              </h2>

              {articles.slice(0, 3).map((article) => (
                <Writer
                  key={article.id}
                  name={article.author.name}
                  description={`@${article.author.username}`}
                />
              ))}
            </section>

            {/* About WriteSpace */}
            <section className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>
                The WriteSpace
              </h2>

              <p className={styles.sidebarDescription}>
                A quiet place for ideas, stories, and thoughtful
                writing.
              </p>

              <div className={styles.tags}>
                <span>Read something new</span>
                <span>Share an idea</span>
                <span>Write your story</span>
              </div>

              <Link
                href="/write"
                className={styles.exploreLink}
              >
                Start writing →
              </Link>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}

function Writer({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className={styles.writer}>
      <div className={styles.writerAvatar}>
        {name.charAt(0)}
      </div>

      <div className={styles.writerInfo}>
        <strong>{name}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}