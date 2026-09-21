/* eslint-disable @next/next/no-img-element */

import {
  searchPublishedArticles,
  searchUsers,
} from "@/lib/articles/queries";

import ArticleCard from "@/components/articles/ArticleCard";
import SearchInput from "@/components/SearchInput/SearchInput";

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

  const query = q?.trim() ?? "";

  const [articles, users] = query
    ? await Promise.all([
        searchPublishedArticles(query),
        searchUsers(query),
      ])
    : [[], []];

  return (
    <main className="explore-page">
      <section className="explore-container">

        <header className="explore-header">
          <p className="explore-eyebrow">
            CURATION & DISCOVERY
          </p>

          <h1>Explore WriteSpace</h1>

          <p className="explore-description">
            Discover writers and articles across WriteSpace.
          </p>
        </header>

        <div className="explore-search">
          <SearchInput />
        </div>

        {query && (
          <div className="search-query">
            Search results for <span>&quot;{query}&quot;</span>
          </div>
        )}

        {!query && (
          <div className="explore-intro">
            <h2>Discover something new</h2>
            <p>
              Search for writers, articles, topics, and ideas
              that interest you.
            </p>
          </div>
        )}

        {users.length > 0 && (
          <section className="explore-section">
            <div className="section-heading">
              <h2>People</h2>
              <span>{users.length} results</span>
            </div>

            <div className="people-results">
              {users.map((user) => (
                <a
                  key={user.id}
                  href={`/${user.username}`}
                  className="person-card"
                >
                  <div className="person-avatar">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                      />
                    ) : (
                      user.username
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="person-info">
                    <h3>{user.name}</h3>
                    <p>@{user.username}</p>
                  </div>

                  <span className="person-arrow">
                    →
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="explore-section">
            <div className="section-heading">
              <h2>Articles</h2>
              <span>{articles.length} results</span>
            </div>

            <div className="explore-articles">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          </section>
        )}

        {query &&
          users.length === 0 &&
          articles.length === 0 && (
            <div className="explore-empty">
              <div className="empty-icon">⌕</div>

              <h2>No results found</h2>

              <p>
                Try searching for a different writer,
                article, or topic.
              </p>
            </div>
          )}

      </section>
    </main>
  );
}