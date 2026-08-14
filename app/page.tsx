import { getPublishedArticles } from "@/lib/articles/queries";
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
  const params = await searchParams;

  const requestedPage = Number(params.page) || 1;

  // Only allow pages 1, 2 and 3
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
    </main>
  );
}