/* eslint-disable @next/next/no-img-element */
import ArticleCard from "@/components/articles/ArticleCard";
import { getSessionUserId } from "@/lib/auth/session";
import {
  getFollowingArticles,
  getFollowingAuthors,
} from "@/lib/articles/queries";
import Link from "next/link";

import "./following.css";

export default async function FollowingPage() {
  const userId = await getSessionUserId();

  if (!userId) {
    return (
      <main className="following-page">
        <section className="following-container">
          <h1>Following</h1>
          <p>Please log in to see articles from writers you follow.</p>
        </section>
      </main>
    );
  }

  const articles = await getFollowingArticles(userId);
  const authors = await getFollowingAuthors(userId);

  return (
    <main className="following-page">
      <div className="following-layout">

        <section className="following-main">

          {/* Header */}
          <header className="following-header">
            <p className="following-eyebrow">
              PERSONALIZED FEED
            </p>

            <h1>Following</h1>

            <p>
              Stories, dispatches, and updates from writers and
              publications you subscribe to.
            </p>
          </header>

          {/* People you follow */}
          <section className="following-authors">
            <div className="authors-header">
              <span>AUTHORS YOU FOLLOW</span>
            </div>

            <div className="author-row">
              {authors.map((author) => (
                <Link
                  href={`/${author.username}`}
                  className="author-bubble"
                  key={author.id}
                >
                  <div className="author-avatar-placeholder">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                      />
                    ) : (
                      author.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <span>{author.name}</span>
                </Link>
              ))}
            </div>
          </section>
          {/* Tabs */}
          <div className="following-tabs">
            <button className="following-tab active">
              Latest Stories
            </button>
          </div>

          {/* Articles */}
          <div className="following-articles">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))
            ) : (
              <div className="following-empty">
                <h2>No articles yet</h2>
                <p>
                  Follow some writers to see their latest articles here.
                </p>
              </div>
            )}
          </div>

        </section>

        {/* Right side */}
        <aside className="following-sidebar">

          <section className="subscription-card">
            <h2>Your Subscriptions</h2>

            <p>
              You follow writers and publications to keep your
              reading feed personalized.
            </p>

            <Link href="/search">
              Find more writers →
            </Link>
          </section>

        </aside>

      </div>
    </main>
  );
}