import { getPublishedArticles } from "@/lib/articles/queries";
import ArticleCard from "@/components/articles/ArticleCard";

export default async function Home() {
  const articles = await getPublishedArticles();

  return (
    <main className="home-page">
      <section className="feed">
        <div className="feed-header">
          <h1>Latest articles</h1>
        </div>
        <hr/>

        <div className="article-list">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      </section>
    </main>
  );
}