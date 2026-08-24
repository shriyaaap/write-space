
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth/session";
import WriteForm from "@/components/articles/WriteForm";
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
          <p>
            Share your ideas with the Write-Space community.
          </p>
        </header>

        <WriteForm />

      </div>
    </main>
  );
}

