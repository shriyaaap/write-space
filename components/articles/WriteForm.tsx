
"use client";

import { useActionState } from "react";
import {
  createDraft,
  publishArticle,
  scheduleArticle,
} from "@/app/actions/articles";
import styles from "@/app/write/write.module.css";

type ActionState = {
  error?: string;
} | null;

const initialState: ActionState = null;

export default function WriteForm() {
  const [draftState, draftAction, draftPending] = useActionState(
    createDraft,
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
          {draftPending ? "Saving..." : "Save Draft"}
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

