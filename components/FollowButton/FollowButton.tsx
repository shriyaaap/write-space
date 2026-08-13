"use client";

import { useState } from "react";
import {
  followUser,
  unfollowUser,
} from "@/app/actions/follow";
import styles from "./FollowButton.module.css";

type FollowButtonProps = {
  userId: string;
  initialFollowing: boolean;
};

export default function FollowButton({
  userId,
  initialFollowing,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFollow() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (following) {
        const result = await unfollowUser(userId);

        if (result.success) {
          setFollowing(false);
        } else {
          setError(result.error ?? "Unable to unfollow.");
        }
      } else {
        const result = await followUser(userId);

        if (result.success) {
          setFollowing(true);
        } else {
          setError(result.error ?? "Unable to follow.");
        }
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={handleFollow}
        disabled={loading}
        className={styles.button}
      >
        {loading
          ? "..."
          : following
          ? "Following"
          : "Follow"}
      </button>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}