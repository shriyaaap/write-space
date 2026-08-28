/* eslint-disable @next/next/no-img-element */
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import ProfileForm from "./ProfileForm";
import styles from "./profile.module.css";

export default async function ProfilePage() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.profileContainer}>

        <header className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
              />
            ) : (
              <span>
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className={styles.profileInfo}>
            <h1>{user.name}</h1>

            <p className={styles.username}>
              @{user.username}
            </p>

            <p className={styles.email}>
              {user.email}
            </p>

            {user.bio && (
              <p className={styles.bio}>
                {user.bio}
              </p>
            )}
          </div>
        </header>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>{user._count.followers}</strong>
            <span>Followers</span>
          </div>

          <div className={styles.stat}>
            <strong>{user._count.following}</strong>
            <span>Following</span>
          </div>
        </div>

        <ProfileForm
          username={user.username}
          name={user.name}
          bio={user.bio}
        />

      </div>
    </main>
  );
}