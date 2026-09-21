import Image from "next/image";
import Link from "next/link";
import styles from "./ArticleCard.module.css";

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
    <article className={styles.card}>

      <div className={styles.content}>

        <div className={styles.authorRow}>
          {article.author.avatar ? (
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={30}
              height={30}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {article.author.name.charAt(0)}
            </div>
          )}

          <span className={styles.authorName}>
            {article.author.name}
          </span>

          <span className={styles.dot}>·</span>

          <span className={styles.publication}>
            WriteSpace
          </span>

          {article.publishedAt && (
            <>
              <span className={styles.dot}>·</span>

              <time className={styles.date}>
                {article.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className={styles.titleLink}
        >
          <h2 className={styles.title}>
            {article.title}
          </h2>
        </Link>

        {article.description && (
          <p className={styles.description}>
            {article.description}
          </p>
        )}

        <div className={styles.bottomRow}>

          <div className={styles.tags}>
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.name}
                className={styles.tag}
              >
                #{tag.name}
              </span>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              aria-label="Bookmark article"
              className={styles.actionButton}
            >
              ♡
            </button>

            <button
              type="button"
              aria-label="More options"
              className={styles.actionButton}
            >
              ···
            </button>
          </div>

        </div>
      </div>

      {article.coverImage && (
        <Link
          href={`/articles/${article.slug}`}
          className={styles.imageLink}
        >
          <Image
            src={article.coverImage}
            alt=""
            width={190}
            height={130}
            className={styles.cover}
          />
        </Link>
      )}

    </article>
  );
}