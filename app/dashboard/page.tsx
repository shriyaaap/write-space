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
    page?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  await publishScheduledArticles();

  const { tab, page: pageParam } = await searchParams;

  const activeTab =
    tab === "published" || tab === "scheduled"
      ? tab
      : "drafts";

  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 3;

  const status =
    activeTab === "drafts"
      ? "DRAFT"
      : activeTab === "scheduled"
        ? "SCHEDULED"
        : "PUBLISHED";

  /*
   * Only fetch the 5 articles needed for the current page.
   * The counts are fetched separately so the dashboard
   * statistics still show the total number of articles.
   */
  const [
    articles,
    publishedCount,
    draftCount,
    scheduledCount,
  ] = await Promise.all([
    prisma.article.findMany({
      where: {
        authorId: userId,
        status,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),

    prisma.article.count({
      where: {
        authorId: userId,
        status: "PUBLISHED",
      },
    }),

    prisma.article.count({
      where: {
        authorId: userId,
        status: "DRAFT",
      },
    }),

    prisma.article.count({
      where: {
        authorId: userId,
        status: "SCHEDULED",
      },
    }),
  ]);

  const totalArticles =
    activeTab === "published"
      ? publishedCount
      : activeTab === "scheduled"
        ? scheduledCount
        : draftCount;

  const totalPages = Math.ceil(totalArticles / pageSize);

  /*
   * If somebody manually enters a page number beyond
   * the available pages, redirect them to the last page.
   */
  if (totalPages > 0 && page > totalPages) {
    redirect(
      `/dashboard?tab=${activeTab}&page=${totalPages}`
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}

        <header className="dashboard-header">
          <div className="dashboard-heading">
            <div className="dashboard-eyebrow">
              <span>Writer Studio</span>
              <span className="dashboard-member">
                Member
              </span>
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
              {publishedCount}
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
              {draftCount}
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
              {scheduledCount}
            </div>

            <div className="stat-description">
              Stories waiting for release
            </div>
          </div>

        </section>

        {/* Article Workspace */}

        <section className="dashboard-workspace">

          {/* Tabs */}

          <nav className="dashboard-tabs">

            <Link
              href="/dashboard?tab=drafts&page=1"
              className={`dashboard-tab ${
                activeTab === "drafts" ? "active" : ""
              }`}
            >
              Drafts
              <span>{draftCount}</span>
            </Link>

            <Link
              href="/dashboard?tab=published&page=1"
              className={`dashboard-tab ${
                activeTab === "published" ? "active" : ""
              }`}
            >
              Published
              <span>{publishedCount}</span>
            </Link>

            <Link
              href="/dashboard?tab=scheduled&page=1"
              className={`dashboard-tab ${
                activeTab === "scheduled" ? "active" : ""
              }`}
            >
              Scheduled
              <span>{scheduledCount}</span>
            </Link>

          </nav>

          {/* Drafts */}

          {activeTab === "drafts" && (
            <section className="dashboard-section">

              <div className="section-heading">
                <h3>Drafts</h3>
                <span>{draftCount} stories</span>
              </div>

              {articles.length === 0 ? (
                <div className="empty-dashboard">
                  <div className="empty-icon">◇</div>

                  <h3>No drafts yet</h3>

                  <p>
                    Start writing your next story and it will
                    appear here.
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

                  {articles.map((article) => (
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
                <span>{scheduledCount} stories</span>
              </div>

              {articles.length === 0 ? (
                <p className="empty-inline">
                  No articles are currently scheduled.
                </p>
              ) : (
                <div className="dashboard-articles">

                  {articles.map((article) => (
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
                <span>{publishedCount} stories</span>
              </div>

              {articles.length === 0 ? (
                <p className="empty-inline">
                  You havent published any stories yet.
                </p>
              ) : (
                <div className="dashboard-articles">

                  {articles.map((article) => (
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

          {/* Pagination */}

          {totalPages > 1 && (
            <div className="pagination">

              {page > 1 && (
                <Link
                  href={`/dashboard?tab=${activeTab}&page=${page - 1}`}
                >
                  ← Previous
                </Link>
              )}

              <span>
                Page {page} of {totalPages}
              </span>

              {page < totalPages && (
                <Link
                  href={`/dashboard?tab=${activeTab}&page=${page + 1}`}
                  className="pagination-button"
                >
                  Next →
                </Link>
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}