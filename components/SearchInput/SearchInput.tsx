"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(
    searchParams.get("q") ?? ""
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        router.push(
          `/search?q=${encodeURIComponent(trimmedQuery)}`
        );
      } else {
        router.push("/search");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <input
      type="search"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search articles..."
    />
  );
}