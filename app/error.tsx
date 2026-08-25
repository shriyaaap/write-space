"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

type ErrorPageProps = {
  error: unknown;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <p className={styles.errorLabel}>Something went wrong</p>
        <h1>We couldn&apos;t load this page.</h1>
        <p className={styles.errorMessage}>
          Something unexpected happened. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className={styles.retryButton}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
