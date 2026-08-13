import { searchPublishedArticles } from "@/lib/articles/queries";
import ArticleCard from "@/components/articles/ArticleCard";
import SearchInput from "@/components/SearchInput/SearchInput";

import "../home/home.css";
import "./search.css";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;

  const query = q ?? "";

  const articles = query
    ? await searchPublishedArticles(query)
    : [];

  return (
    <main className="home-page">
      <section className="feed">
        <div className="feed-header">
          <h1>Search</h1>

          <div className="search-form">
            <SearchInput />
          </div>
        </div>

        {query && (
          <p>
            Search results for &quot;{query}&quot;
          </p>
        )}

        <div className="article-list">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))
          ) : query ? (
            <p>No articles found.</p>
          ) : (
            <p className="pt-2">Search for an article to get started.</p>
          )}
        </div>
      </section>
    </main>
  );
}