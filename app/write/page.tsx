import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth/session";
import { createDraft } from "@/app/actions/articles";
import styles from "./write.module.css";

export default async function WritePage() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <main className={styles.writePage}>
      <div className={styles.writeContainer}>

        <header className={styles.writeHeader}>
          <h1>Write an article</h1>
          <p>Share your ideas with the Write-Space community.</p>
        </header>

        <form
          action={createDraft}
          className={styles.writeForm}
        >
          <input
            className={styles.writeInput}
            type="text"
            name="title"
            placeholder="Article title"
            required
          />

          <textarea
            className={styles.writeDescription}
            name="description"
            placeholder="Write a short description..."
          />

          <textarea
            className={styles.writeContent}
            name="content"
            placeholder="Start writing..."
            required
          />

          <div className={styles.writeActions}>
            <button
              type="submit"
              className={styles.saveDraftButton}
            >
              Save Draft
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}