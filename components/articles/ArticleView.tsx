"use client";

import { useEffect, useRef } from "react";
import { recordArticleView } from "@/app/actions/articles";

type ArticleViewProps = {
  articleId: string;
};

export default function ArticleView({
  articleId,
}: ArticleViewProps) {
  const hasRecordedView = useRef(false);

  useEffect(() => {
    if (hasRecordedView.current) {
      return;
    }

    hasRecordedView.current = true;

    recordArticleView(articleId);
  }, [articleId]);

  return null;
}