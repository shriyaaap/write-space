import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { deleteArticle } from "@/app/actions/articles";
import Link from "next/link";

import "./dashboard.css";

export default async function DashboardPage() {
  const userId = await getSessionUserId();

  // User is not logged in
  if (!userId) {
    redirect("/login");
  }

  // Get only this user's articles
  const articles = await prisma.article.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const drafts = articles.filter(
    (article) => article.status === "DRAFT"
  );

  const scheduled = articles.filter(
    (article) => article.status === "SCHEDULED"
  );

  const published = articles.filter(
    (article) => article.status === "PUBLISHED"
  );

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">Writer dashboard</p>
            <h1>My Articles</h1>
          </div>

          <Link href="/write" className="new-article-button">
            + New Article
          </Link>
        </header>
        <hr/>

        {/* Drafts */}
        <section className="dashboard-section">
          <h2>Drafts</h2>

          {drafts.length === 0 ? (
            <p className="empty-message">
              You dont have any drafts yet.
            </p>
          ) : (
            <div className="article-list">
              {drafts.map((article) => (
                <article
                  className="dashboard-article"
                  key={article.id}
                >
                  <div>
                    <h3>{article.title}</h3>

                    <p>
                      Last edited{" "}
                      {article.updatedAt.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="dashboard-actions">
                    <a href={`/write/${article.id}`}>
                      Edit
                    </a>
                  <form action={deleteArticle}>
                    <input
                      type="hidden"
                      name="articleId"
                      value={article.id}
                    />

                    <button type="submit">
                      Delete
                    </button>
                </form>
                  </div>
                  
                </article>
              ))}
            </div>
          )}
        </section>
        <hr/>

        {/* Scheduled */}
        <section className="dashboard-section">
          <h2>Scheduled</h2>

          {scheduled.length === 0 ? (
            <p className="empty-message">
              You dont have any scheduled articles.
            </p>
          ) : (
            <div className="article-list">
              {scheduled.map((article) => (
                <article
                  className="dashboard-article"
                  key={article.id}
                >
                  <div>
                    <h3>{article.title}</h3>

                    <p>
                      Scheduled for{" "}
                      {article.scheduledAt
                        ? article.scheduledAt.toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>
                  <div className="dashboard-actions">
                      <a href={`/write/${article.id}`}>
                        Edit
                      </a>
                      <form action={deleteArticle}>
                        <input
                          type="hidden"
                          name="articleId"
                          value={article.id}
                        />

                        <button type="submit">
                          Delete
                        </button>
                    </form>
                  </div>
                  
                </article>
              ))}
            </div>
          )}
        </section>

        <hr/>

        {/* Published */}
        <section className="dashboard-section">
          <h2>Published</h2>

          {published.length === 0 ? (
            <p className="empty-message">
              You havent published any articles yet.
            </p>
          ) : (
            <div className="article-list">
              {published.map((article) => (
                <article
                  className="dashboard-article"
                  key={article.id}
                >
                  <div>
                    <h3>{article.title}</h3>

                    <p>
                      Published{" "}
                      {article.publishedAt
                        ? article.publishedAt.toLocaleDateString()
                        : "Unknown date"}
                    </p>

                    <div className="article-stats">
                      <span>
                        {article.views} views
                      </span>

                    </div>
                  </div>

                  <div className="dashboard-actions">
                    <a href={`/articles/${article.slug}`}>
                      View
                    </a>

                    <form action={deleteArticle}>
                      <input
                        type="hidden"
                        name="articleId"
                        value={article.id}
                      />

                      <button type="submit">
                        Delete
                      </button>
                    </form>
                </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}