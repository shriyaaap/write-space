import { getPublishedArticles } from "@/lib/articles/queries";
import { getSessionUserId } from "@/lib/auth/session";
import ArticleCard from "@/components/articles/ArticleCard";
import Link from "next/link";

type HomePageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Home({
  searchParams,
}: HomePageProps) {
  // Check session status directly
  const userId = await getSessionUserId();

  // 1. UNAUTHENTICATED USER: Show Hero Banner ONLY
  if (!userId) {
    return (
      <main className="landing-container">
        <section className="full-page-hero">
          <div className="hero-content">
            <h1 className="hero-quote">
              &ldquo;An article is not a piece of paper; it is a paper which brings peace.&rdquo;
            </h1>
            <p className="hero-subtext">
              Discover insightful stories, deep dives, and ideas that bring clarity.
            </p>
            <Link href="/login" className="hero-btn-primary">
              Get Started
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // 2. AUTHENTICATED USER: Render Latest Articles Feed
  const params = await searchParams;
  const requestedPage = Number(params.page) || 1;
  const page = Math.min(Math.max(requestedPage, 1), 3);
  const articles = await getPublishedArticles(page, 10);

  return (
    <main className="home-page">
      <section className="feed">
        <div className="feed-header">
          <h1>Latest articles</h1>
        </div>

        <hr />

        <div className="article-list">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>

        <div className="pagination">
          {page > 1 && (
            <Link href={`/?page=${page - 1}`}>
              ← Previous
            </Link>
          )}

          <span>Page {page} of 3</span>

          {page < 3 && (
            <Link href={`/?page=${page + 1}`}>
              Next →
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}