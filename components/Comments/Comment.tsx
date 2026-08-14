"use client";

import { useState } from "react";
import { createComment, deleteComment } from "@/app/actions/comment";
import "./Comment.css"

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
};

type CommentsProps = {
  articleId: string;
  initialComments: Comment[];
  articleAuthorId: string;
  currentUserId: string | null;
};

export default function Comments({
  articleId,
  initialComments,
  articleAuthorId,
  currentUserId,
}: CommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    const result = await createComment(articleId, content);

    if (result.success && result.comment) {
      setComments((current) => [result.comment, ...current]);
      setContent("");
    } else if (!result.success) {
      setError(result.error ?? "Unable to add comment.");
    }else {
      setError(result.error ?? "Unable to add comment.");
    }

    setLoading(false);
  }

  async function handleDelete(commentId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmed) {
    return;
  }

  const result = await deleteComment(commentId);

  if (result.success) {
    setComments((current) =>
      current.filter((comment) => comment.id !== commentId)
    );
  } else {
    setError(result.error ?? "Unable to delete comment.");
  }
}

  return (
    <section className="comments-section">
      <h2>Comments</h2>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment..."
          maxLength={1000}
          rows={4}
        />

        {error && <p className="comment-error">{error}</p>}

        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Posting..." : "Post comment"}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="comment">
              <div className="comment-author">
                {comment.author.avatar && (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                  />
                )}

                <div>
                  <strong>{comment.author.name}</strong>
                  <span>@{comment.author.username}</span>
                </div>
              </div>

              <p>{comment.content}</p>

              <time>
  {new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )}
</time>

{currentUserId === articleAuthorId && (
  <button
    type="button"
    onClick={() => handleDelete(comment.id)}
    className="delete-comment-button"
  >
    Delete
  </button>
)}
            </article>
          ))
        )}
      </div>
    </section>
  );
}