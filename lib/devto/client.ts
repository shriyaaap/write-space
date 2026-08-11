const DEV_TO_API = "https://dev.to/api";

export async function getDevToArticle(id: number) {
  const response = await fetch(`${DEV_TO_API}/articles/${id}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Dev.to article ${id}: ${response.status}`
    );
  }

  return response.json();
}