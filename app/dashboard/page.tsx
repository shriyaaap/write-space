import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { publishScheduledArticles } from "@/app/actions/articles";
import Link from "next/link";
import DeleteArticleButton from "@/components/DeleteArticleButton/DeleteArticleButton";

import "./dashboard.css";

type DashboardPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {

  const userId = await getSessionUserId();

  // User is not logged in
  if (!userId) {
    redirect("/login");
  }

  await publishScheduledArticles();

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

  const { tab } = await searchParams;

  const activeTab =
    tab === "published" || tab === "scheduled"
      ? tab
      : "drafts";

  return (
  <main className="dashboard-page">
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div className="dashboard-heading">
          <div className="dashboard-eyebrow">
            <span>Writer Studio</span>
            <span className="dashboard-member">Member</span>
          </div>

          <h1>Stories &amp; Performance</h1>

          <p>
            Manage your manuscripts, track your published work,
            and continue writing without interruption.
          </p>
        </div>

        <div className="dashboard-header-actions">

          <Link
            href="/write"
            className="new-article-button"
          >
            + New Article
          </Link>
        </div>
      </header>


      {/* Statistics */}

      <section className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Published</span>
            <span className="stat-icon">◫</span>
          </div>

          <div className="stat-value">
            {published.length}
          </div>

          <div className="stat-description">
            Published stories
          </div>

          
        </div>


        <div className="stat-card">
          <div className="stat-card-top">
            <span>Drafts</span>
            <span className="stat-icon">◇</span>
          </div>

          <div className="stat-value">
            {drafts.length}
          </div>

          <div className="stat-description">
            Stories in progress
          </div>

          
        </div>


        <div className="stat-card">
          <div className="stat-card-top">
            <span>Scheduled</span>
            <span className="stat-icon">◷</span>
          </div>

          <div className="stat-value">
            {scheduled.length}
          </div>

          <div className="stat-description">
            Stories waiting for release
          </div>

          
        </div>

      </section>


      {/* Article workspace */}

      <section className="dashboard-workspace">

        <nav className="dashboard-tabs">

        <Link
          href="/dashboard?tab=drafts"
          className={`dashboard-tab ${
            activeTab === "drafts" ? "active" : ""
          }`}
        >
          Drafts
          <span>{drafts.length}</span>
        </Link>

        <Link
          href="/dashboard?tab=published"
          className={`dashboard-tab ${
            activeTab === "published" ? "active" : ""
          }`}
        >
          Published
          <span>{published.length}</span>
        </Link>

        <Link
          href="/dashboard?tab=scheduled"
          className={`dashboard-tab ${
            activeTab === "scheduled" ? "active" : ""
          }`}
        >
          Scheduled
          <span>{scheduled.length}</span>
        </Link>

      </nav>


        {/* Drafts */}

        {activeTab === "drafts" && (
  <section className="dashboard-section">

    <div className="section-heading">
      <h3>Drafts</h3>
      <span>{drafts.length} stories</span>
    </div>

    {drafts.length === 0 ? (
      <div className="empty-dashboard">
        <div className="empty-icon">◇</div>

        <h3>No drafts yet</h3>

        <p>
          Start writing your next story and it will appear here.
        </p>

        <Link
          href="/write"
          className="empty-action"
        >
          Write a story
        </Link>
      </div>
    ) : (
      <div className="dashboard-articles">

        {drafts.map((article) => (
          <article
            className="dashboard-article"
            key={article.id}
          >

            <div className="dashboard-article-image">
              <span>✎</span>
            </div>

            <div className="dashboard-article-info">

              <div className="dashboard-article-meta">
                <span className="status-badge">
                  Draft
                </span>

                <span>
                  Edited{" "}
                  {article.updatedAt.toLocaleDateString()}
                </span>
              </div>

              <h3>
                {article.title || "Untitled story"}
              </h3>

              <p>
                Continue working on this story.
              </p>

            </div>

            <div className="dashboard-actions">

              <Link
                href={`/write/${article.id}`}
                className="edit-button"
              >
                Edit
              </Link>

              <DeleteArticleButton
                articleId={article.id}
              />

            </div>

          </article>
        ))}

      </div>
    )}

  </section>
)}

        {/* Scheduled */}
        {activeTab === "scheduled" && (

        <section className="dashboard-section">

          <div className="section-heading">
            <h3>Scheduled for Release</h3>
            <span>{scheduled.length} stories</span>
          </div>

          {scheduled.length === 0 ? (
            <p className="empty-inline">
              No articles are currently scheduled.
            </p>
          ) : (
            <div className="dashboard-articles">

              {scheduled.map((article) => (
                <article
                  className="dashboard-article"
                  key={article.id}
                >

                  <div className="dashboard-article-image scheduled-image">
                    <span>◷</span>
                  </div>

                  <div className="dashboard-article-info">

                    <div className="dashboard-article-meta">
                      <span className="status-badge scheduled-badge">
                        Scheduled
                      </span>

                      <span>
                        {article.scheduledAt
                          ? article.scheduledAt.toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>

                    <h3>
                      {article.title || "Untitled story"}
                    </h3>

                    <p>
                      This story is scheduled for publication.
                    </p>

                  </div>

                  <div className="dashboard-actions">

                    <Link
                      href={`/write/${article.id}`}
                      className="edit-button"
                    >
                      Edit
                    </Link>

                    <DeleteArticleButton
                      articleId={article.id}
                    />

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>
        )}

        {/* Published */}
        {activeTab === "published" && (
        <section className="dashboard-section">

          <div className="section-heading">
            <h3>Published</h3>
            <span>{published.length} stories</span>
          </div>

          {published.length === 0 ? (
            <p className="empty-inline">
              You havent published any stories yet.
            </p>
          ) : (
            <div className="dashboard-articles">

              {published.map((article) => (
                <article
                  className="dashboard-article"
                  key={article.id}
                >

                  <div className="dashboard-article-image published-image">
                    <span>◫</span>
                  </div>

                  <div className="dashboard-article-info">

                    <div className="dashboard-article-meta">
                      <span className="status-badge published-badge">
                        Published
                      </span>

                      <span>
                        {article.publishedAt
                          ? article.publishedAt.toLocaleDateString()
                          : "Unknown date"}
                      </span>
                    </div>

                    <h3>
                      {article.title}
                    </h3>

                    <p>
                      {article.views.toLocaleString()} views
                    </p>

                  </div>

                  <div className="dashboard-actions">

                    <Link
                      href={`/articles/${article.slug}`}
                      className="edit-button"
                    >
                      View
                    </Link>

                    <DeleteArticleButton
                      articleId={article.id}
                    />

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>
        )}

      </section>

    </div>
  </main>
);
}