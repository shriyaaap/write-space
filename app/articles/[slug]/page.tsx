/* eslint-disable @next/next/no-img-element */
import "../article.css"

import { calculateReadTime } from "@/lib/articles/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug, isFollowingUser, } from "@/lib/articles/queries";
import { getSessionUserId } from "@/lib/auth/session";
import MarkdownContent from "@/components/articles/MarkdownContent";
import ArticleView from "@/components/articles/ArticleView";

import Comments from "@/components/Comments/Comment";
import ClapButton from "@/components/ClapButton/ClapButton";
import FollowButton from "@/components/FollowButton/FollowButton";
import ArticleReadProgress from "@/components/articles/ArticleReadProgress";


type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found | Write-Space",
    };
  }

  return {
    title: `${article.title} | Write-Space`,
    description: article.description ?? `Read ${article.title} on Write-Space`,
    openGraph: {
      title: article.title,
      description:
        article.description ?? `Read ${article.title} on Write-Space`,
      type: "article",
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
    
  const { slug } = await params;

  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }


  const userId = await getSessionUserId();

  const existingFollow = userId
  ? await isFollowingUser(userId, article.authorId)
  : null;

  const isFollowing = !!existingFollow;


  const hasClapped = userId
    ? article.claps.some((clap) => clap.userId === userId)
    : false;
  const readTime = calculateReadTime(article.content);
  

  return (
    <main className="article-page">
      <ArticleView articleId={article.id} />
      <article className="article-container">
        <ArticleReadProgress articleId={article.id} />
        <header className="article-header">
          <div className="article-author">
            {article.author.avatar && (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="author-avatar"
              />
            )}

            <div>
              <div className="article-author-info">
                <Link href={`/${article.author.username}`}>
                  {article.author.name}
                </Link>

                {userId !== article.authorId && (
                  <FollowButton
                    userId={article.authorId}
                    initialFollowing={isFollowing}
                  />
                )}
            </div>

              {article.publishedAt && (
                <time>
                  <div className="article-meta">
                    {article.publishedAt && (
                        <time>
                        {article.publishedAt.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                        </time>
                    )}

                    <span>·</span>

                    <span>{readTime} min read</span>
                    <span>{article.views} views</span>
                    <ClapButton
                      articleId={article.id}
                      initialCount={article.claps.length}
                      initialClapped={hasClapped}
                    />
                    </div>
                </time>
              )}
            </div>
          </div>

          <h1>{article.title}</h1>

          {article.description && (
            <p className="article-subtitle">
              {article.description}
            </p>
          )}

          <div className="article-tags">
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.name)}`}
              >
                #{tag.name}
              </Link>
            ))}
        </div>
        </header>

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt=""
            className="article-main-image"
          />
        )}

        <div className="article-body">
            <MarkdownContent content={article.content} />
        </div>

        <Comments
          articleId={article.id}
          initialComments={article.comments}
          articleAuthorId={article.author.id}
          currentUserId={userId}
        />
      </article>
    </main>
  );
}