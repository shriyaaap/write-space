import { getPublishedArticles } from "@/lib/articles/queries";

export default async function Home() {
  const articles = await getPublishedArticles();

  return (
    <main>
      <h1>Write-Space</h1>

      <pre>
        {JSON.stringify(articles.slice(0, 2), null, 2)}
      </pre>
    </main>
  );
}