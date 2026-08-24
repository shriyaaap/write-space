import Image from "next/image";
import Link from "next/link";

type ArticleCardProps = {
  article: {
    slug: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    author: {
      name: string;
      username: string;
      avatar: string | null;
    };
    tags: {
      name: string;
    }[];
  };
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <div className="article-card-content">
        <div className="article-author">
          {article.author.avatar && (
            <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={28}
                height={28}
                className="author-avatar"
            />
          )}

          <span>{article.author.name}</span>

          {article.publishedAt && (
            <>
              <span>·</span>
              <time>
                {article.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        <Link href={`/articles/${article.slug}`}>
          <h2 className="article-title">{article.title}</h2>
        </Link>

        {article.description && (
          <p className="article-description">
            {article.description}
          </p>
        )}

        <div className="article-meta">
          <div className="article-tags">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag.name}>#{tag.name}</span>
            ))}
          </div>
        </div>
      </div>

      {article.coverImage && (
        <Image
            src={article.coverImage}
            alt=""
            width={160}
            height={110}
            className="article-cover"
        />
      )}
    </article>
  );
}
