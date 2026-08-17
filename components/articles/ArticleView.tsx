"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { recordArticleView } from "@/app/actions/articles";

type ArticleViewProps = {
  articleId: string;
};

export default function ArticleView({
  articleId,
}: ArticleViewProps) {
  const router = useRouter();

  useEffect(() => {
    async function recordView() {
      await recordArticleView(articleId);
      router.refresh();
    }

    recordView();
  }, [articleId, router]);

  return null;
}