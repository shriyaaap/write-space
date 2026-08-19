"use client";

import { useEffect, useState } from "react";

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
            style={{
                position: "fixed",
                width: "100%",
                maxWidth: "760px",
                top: "65px",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgb(0, 0, 0, 0.1)",
                    height: "10px",
                    borderRadius: "20px",
                }}
            >
                <div
                    style={{
                        height: "10px",
                        width: `${progress}%`,
                        backgroundColor: "currentColor",
                        borderRadius: "20px",
                    }}
                />
            </div>
        </div>
    );
}