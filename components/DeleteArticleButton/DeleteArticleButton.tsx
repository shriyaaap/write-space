"use client";

import { useState } from "react";
import { deleteArticle } from "@/app/actions/articles";
import styles from "./DeleteArticleButton.module.css";

type DeleteArticleButtonProps = {
  articleId: string;
};

export default function DeleteArticleButton({
  articleId,
}: DeleteArticleButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => setShowConfirmation(true)}
      >
        Delete
      </button>

      {showConfirmation && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Delete article?</h2>

            <p>
              Are you sure you want to delete this article?
              This action cannot be undone.
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>

              <form action={deleteArticle}>
                <input
                  type="hidden"
                  name="articleId"
                  value={articleId}
                />

                <button
                  type="submit"
                  className={styles.confirmButton}
                >
                  Yes, delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}