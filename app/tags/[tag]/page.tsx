import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getArticlesByTag } from "@/lib/articles/queries";
import ArticleCard from "@/components/articles/ArticleCard";

import "./tag.css";

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `#${tag} | Write-Space`,
    description: `Articles about ${tag} on Write-Space.`,
  };
}

export default async function TagPage({
  params,
}: TagPageProps) {
  const { tag } = await params;

  const articles = await getArticlesByTag(tag);

  return (
    <main className="tag-page">
      <section className="tag-container">

        <header className="tag-header">
          <p className="tag-label">Topic</p>
          <h1>#{tag}</h1>
          <p>
            Articles about {tag}
          </p>
        </header>

        <hr />

        <section className="tag-articles">
          {articles.length === 0 ? (
            <p className="tag-empty">
              No articles found for this tag.
            </p>
          ) : (
            <div className="article-list">
              {articles.map((article) => (
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