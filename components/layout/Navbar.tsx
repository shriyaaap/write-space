"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { logout } from "@/app/actions/auth";

type NavbarProps = {
  userId: string | null;
  username: string | null;
  avatar: string | null;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({
  userId,
  username,
  avatar,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const firstLetter =
    username?.charAt(0).toUpperCase() || "U";

  return (
    <header className={styles.navbar}>

      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          WriteSpace
        </Link>

      </div>

      <div className={styles.center}>

        {userId && (
          <Link
            href="/search"
            className={styles.search}
          >
            <span className={styles.searchIcon}>
              ⌕
            </span>

            <span>
              Search stories, topics, writers...
            </span>
          </Link>
        )}

      </div>

      <div className={styles.right}>

        {userId && (
          <Link
            href="/write"
            className={styles.writeButton}
          >
            + New Story
          </Link>
        )}

        {userId ? (
          <div className={styles.profileMenu}>

            <button
              type="button"
              className={styles.profileButton}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              onClick={() =>
                setProfileOpen((current) => !current)
              }
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={username || "Profile"}
                  width={38}
                  height={38}
                  className={styles.profileAvatar}
                />
              ) : (
                <span className={styles.profileLetter}>
                  {firstLetter}
                </span>
              )}
            </button>

            {profileOpen && (
              <div className={styles.profileDropdown}>

                <p className={styles.profileName}>
                  {username}
                </p>

                <Link
                  href={`${username}`}
                  className={styles.dropdownLink}
                  onClick={() => setProfileOpen(false)}
                >
                  View profile
                </Link>

                <Link
                  href="/editprofile"
                  className={styles.dropdownLink}
                  onClick={() => setProfileOpen(false)}
                >
                  Settings
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className={styles.profileLogout}
                  >
                    Logout
                  </button>
                </form>

              </div>
            )}

          </div>
        ) : (
          <Link
            href="/login"
            className={styles.loginButton}
          >
            Get Started
          </Link>
        )}

      </div>

    </header>
  );
}