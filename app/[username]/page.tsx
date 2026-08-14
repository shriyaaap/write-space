import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton/FollowButton";
import { getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

import {
  getAuthorByUsername,
} from "@/lib/articles/queries";

import ArticleCard from "@/components/articles/ArticleCard";

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

    let isFollowing = false;

    if (currentUserId && currentUserId !== author.id) {
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
      <section className="profile-container">

        <header className="profile-header">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="profile-avatar"
            />
          )}

          <div className="profile-info">
            <h1>{author.name}</h1>

            <p className="profile-username">
              @{author.username}
            </p>

            {author.bio && (
              <p className="profile-bio">
                {author.bio}
              </p>
            )}

            {currentUserId !== author.id && (
                <FollowButton
                    userId={author.id}
                    initialFollowing={isFollowing}
                />
            )}
          </div>
        </header>

        <div className="profile-divider" />

        <section className="profile-articles">
          <h2>Articles</h2>

          {author.articles.length === 0 ? (
            <p className="profile-empty">
              This author hasnt published any articles yet.
            </p>
          ) : (
            <div className="article-list">
              {author.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </section>

      </section>
    </main>
  );
}