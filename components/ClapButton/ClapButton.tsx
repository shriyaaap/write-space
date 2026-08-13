"use client";

import { useState } from "react";
import { clapArticle } from "@/app/actions/clap";

type ClapButtonProps = {
  articleId: string;
  initialCount: number;
  initialClapped: boolean;
};

export default function ClapButton({
  articleId,
  initialCount,
  initialClapped,
}: ClapButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [clapped, setClapped] = useState(initialClapped);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClap() {
    console.log("Clap clicked");
    console.log("Article ID:", articleId);

    if (loading || clapped) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await clapArticle(articleId);

      console.log("Clap result:", result);

      if (result.success) {
        setCount((current) => current + 1);
        setClapped(true);
      } else {
        setError(result.error ?? "Unable to clap.");
      }
    } catch (error) {
      console.error("Clap error:", error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClap}
        disabled={loading || clapped}
      >
        {loading
          ? "Clapping..."
          : clapped
          ? `👏 Clapped ${count}`
          : `👏 Clap ${count}`}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}