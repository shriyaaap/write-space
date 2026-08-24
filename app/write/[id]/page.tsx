import { redirect, notFound } from "next/navigation";
import { getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import EditArticleForm from "./EditArticleForm";
import styles from "../write.module.css";

type EditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: EditPageProps) {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;

  const article = await prisma.article.findFirst({
    where: {
      id,
      authorId: userId,
      status: {
        in: ["DRAFT", "SCHEDULED"],
      },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.writePage}>
      <div className={styles.writeContainer}>
        <header className={styles.writeHeader}>
          <h1>Edit article</h1>
          <p>Continue working on your article.</p>
        </header>

        <EditArticleForm article={article} />
      </div>
    </main>
  );
}