import { calculateReadTime } from "@/lib/articles/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/articles/queries";
import Image from "next/image";
import MarkdownContent from "@/components/articles/MarkdownContent";

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
  const readTime = calculateReadTime(article.content);

  return (
    <main className="article-page">
      <article className="article-container">
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
              <p>{article.author.name}</p>

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
              <span key={tag.id}>#{tag.name}</span>
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
      </article>
    </main>
  );
}