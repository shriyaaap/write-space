const DEV_TO_API = "https://dev.to/api";

export async function getDevToArticles(page: number = 1) {
  const response = await fetch(
    `${DEV_TO_API}/articles?per_page=100&page=${page}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Dev.to articles: ${response.status}`
    );
  }

  return response.json();
}