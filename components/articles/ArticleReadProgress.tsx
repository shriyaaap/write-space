"use client";

import { useEffect, useState } from "react";
import styles from "./ArticleReadProgress.module.css"

type Props = {
    articleId: string;
};

export default function ArticleReadProgress({ articleId }: Props) {
    const [progress, setProgress] = useState(0);

    const STORAGE_KEY = `article-read-progress-${articleId}`;

    useEffect(() => {
        const saved = Number(sessionStorage.getItem(STORAGE_KEY));

        if (!isNaN(saved) && saved > 0) {
            requestAnimationFrame(() => {
                const scrollHeight =
                    document.documentElement.scrollHeight - window.innerHeight;

                window.scrollTo({
                    top: (saved / 100) * scrollHeight,
                });

                setProgress(saved);
            });
        }
    }, [STORAGE_KEY]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) return;

            const currentProgress = Math.round(
                (window.scrollY / scrollHeight) * 100
            );

            setProgress(currentProgress);
            sessionStorage.setItem(STORAGE_KEY, String(currentProgress));
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [STORAGE_KEY]);

    if (progress === 0) return null;

    return (
        <div
            className={styles.progressContainer}
            aria-label="Reading progress"
            data-tooltip="Reading progress"
            tabIndex={0}
        >
            <div className={styles.progressBar}>
                <div style={{
                    width: `${progress}%`
                }} className={styles.progressBarFill} />
            </div>
            <p className={styles.progressText}>{progress}%</p>
        </div>
    );
}