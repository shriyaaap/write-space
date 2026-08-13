import { redirect, notFound } from "next/navigation";
import { getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { updateDraft, publishArticle, scheduleArticle } from "@/app/actions/articles";
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
      status: "DRAFT",
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
          <p>Continue working on your draft.</p>
        </header>

        <form
          action={updateDraft}
          className={styles.writeForm}
        >
          <input
            type="hidden"
            name="id"
            value={article.id}
          />

          <input
            className={styles.writeInput}
            type="text"
            name="title"
            placeholder="Article title"
            defaultValue={article.title}
            required
          />

          <textarea
            className={styles.writeDescription}
            name="description"
            placeholder="Write a short description..."
            defaultValue={article.description ?? ""}
          />

          <textarea
            className={styles.writeContent}
            name="content"
            placeholder="Start writing..."
            defaultValue={article.content}
            required
          />

          <div className={styles.writeActions}>
            <button
              type="submit"
              className={styles.saveDraftButton}
            >
              Save Changes
            </button>

            <button
              type="submit"
              className={styles.saveDraftButton}
              formAction={publishArticle}
            >
              Publish
            </button>
          </div>

          <div className={styles.scheduleSection}>
            <label htmlFor="scheduledAt">
              Schedule for 
            </label>

            <input
              id="scheduledAt"
              type="datetime-local"
              name="scheduledAt"
              className={styles.scheduleInput}
            />

            <button
              type="submit"
              formAction={scheduleArticle}
              className={styles.scheduleButton}
            >
              Schedule
            </button>
        </div>
        </form>
      </div>
    </main>
  );
}