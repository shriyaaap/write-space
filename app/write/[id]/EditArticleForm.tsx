"use client";

import { useActionState } from "react";
import {
  updateDraft,
  publishArticle,
  scheduleArticle,
} from "@/app/actions/articles";
import styles from "../write.module.css";

type Props = {
  article: {
    id: string;
    title: string;
    description: string | null;
    content: string;
    scheduledAt: Date | null;
  };
};

type ActionState = {
  error?: string;
} | null;

const initialState: ActionState = null;

export default function EditArticleForm({ article }: Props) {
  const [draftState, draftAction, draftPending] = useActionState(
    updateDraft,
    initialState
  );

  const [publishState, publishAction, publishPending] = useActionState(
    publishArticle,
    initialState
  );

  const [scheduleState, scheduleAction, schedulePending] = useActionState(
    scheduleArticle,
    initialState
  );

  const error =
    draftState?.error ||
    publishState?.error ||
    scheduleState?.error;

  const pending =
    draftPending ||
    publishPending ||
    schedulePending;

  return (
    <form className={styles.writeForm}>
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

      {error && (
        <p className={styles.formError}>
          {error}
        </p>
      )}

      <div className={styles.writeActions}>
        <button
          type="submit"
          formAction={draftAction}
          className={styles.saveDraftButton}
          disabled={pending}
        >
          {draftPending ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="submit"
          formAction={publishAction}
          className={styles.saveDraftButton}
          disabled={pending}
        >
          {publishPending ? "Publishing..." : "Publish"}
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
          defaultValue={
            article.scheduledAt
              ? new Date(article.scheduledAt)
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
        />

        <button
          type="submit"
          formAction={scheduleAction}
          className={styles.scheduleButton}
          disabled={pending}
        >
          {schedulePending ? "Scheduling..." : "Schedule"}
        </button>
      </div>
    </form>
  );
}