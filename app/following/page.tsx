import ArticleCard from "@/components/articles/ArticleCard";
import { getSessionUserId } from "@/lib/auth/session";
import { getFollowingArticles } from "@/lib/articles/queries";


import "../home/home.css";
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

  return (
    <main className="following-page">
      <section className="following-container">
        <div className="following-header">
          <h1>Following</h1>
          <p>Articles from writers you follow.</p>
        </div>

        <div className="article-list">
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
    </main>
  );
}