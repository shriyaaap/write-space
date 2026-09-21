import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import FollowButton from "@/components/FollowButton/FollowButton";
import ArticleCard from "@/components/articles/ArticleCard";
import { getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getAuthorByUsername } from "@/lib/articles/queries";

import "./profile.css";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;

  const author = await getAuthorByUsername(username);

  if (!author) {
    return {
      title: "Author not found | Write-Space",
    };
  }

  return {
    title: `${author.name} | Write-Space`,
    description:
      author.bio ?? `Read articles written by ${author.name}.`,
  };
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { username } = await params;

  const author = await getAuthorByUsername(username);

  if (!author) {
    notFound();
  }

  const currentUserId = await getSessionUserId();

  const isOwnProfile = currentUserId === author.id;

  let isFollowing = false;

  if (currentUserId && !isOwnProfile) {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: author.id,
        },
      },
    });

    isFollowing = !!existingFollow;
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* PROFILE HEADER */}
        <header className="profile-header">

          <div className="profile-main">

            <div className="profile-avatar-wrapper">
              {author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar profile-avatar-placeholder">
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="profile-name-row">
                <h1>{author.name}</h1>
              </div>

              <p className="profile-username">
                @{author.username}
              </p>

              {author.bio && (
                <p className="profile-bio">
                  {author.bio}
                </p>
              )}
            </div>

          </div>

          {/* PROFILE ACTION */}
          <div className="profile-actions">

            {isOwnProfile ? (
              <Link
                href="/editprofile"
                className="edit-profile-button"
              >
                Edit Profile
              </Link>
            ) : (
              currentUserId && (
                <FollowButton
                  userId={author.id}
                  initialFollowing={isFollowing}
                />
              )
            )}

          </div>
        </header>

        {/* PROFILE STATS */}
        <div className="profile-stats">

          <div className="profile-stat">
            <span className="profile-stat-number">
              {author.articles.length}
            </span>
            <span className="profile-stat-label">
              Articles
            </span>
          </div>

          <div className="profile-stat">
            <span className="profile-stat-number">
              {author._count?.followers ?? 0}
            </span>
            <span className="profile-stat-label">
              Followers
            </span>
          </div>

          <div className="profile-stat">
            <span className="profile-stat-number">
              {author._count?.following ?? 0}
            </span>
            <span className="profile-stat-label">
              Following
            </span>
          </div>

        </div>

        {/* CONTENT */}
        <section className="profile-content">

          <div className="profile-content-header">
            <h2>Stories</h2>

            <span>
              {author.articles.length}{" "}
              {author.articles.length === 1
                ? "article"
                : "articles"}
            </span>
          </div>

          {author.articles.length === 0 ? (
            <div className="profile-empty">
              <h3>No articles yet</h3>

              <p>
                {isOwnProfile
                  ? "Start writing your first story."
                  : "This writer hasnt published any articles yet."}
              </p>

              {isOwnProfile && (
                <Link
                  href="/write"
                  className="profile-write-button"
                >
                  Write an article
                </Link>
              )}
            </div>
          ) : (
            <div className="profile-articles">
              {author.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}