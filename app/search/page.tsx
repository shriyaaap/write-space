/* eslint-disable @next/next/no-img-element */
import {
  searchPublishedArticles,
  searchUsers,
} from "@/lib/articles/queries";

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

  const [articles, users] = query
    ? await Promise.all([
        searchPublishedArticles(query),
        searchUsers(query),
      ])
    : [[], []];

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

        {/* USERS */}
        {users.length > 0 && (
          <section className="search-users">
            <h2>People</h2>

            <div className="user-results">
              {users.map((user) => (
                <a
                  key={user.id}
                  href={`/${user.username}`}
                  className="user-result"
                >
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                      />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <span>@{user.username}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ARTICLES */}
        {articles.length > 0 && (
          <section className="search-articles">
            <h2>Articles</h2>

            <div className="article-list">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          </section>
        )}

        {/* NO RESULTS */}
        {query &&
          users.length === 0 &&
          articles.length === 0 && (
            <p>No results found.</p>
          )}

        {!query && (
          <p className="pt-2">
            Search for an article or user to get started.
          </p>
        )}

      </section>
    </main>
  );
}