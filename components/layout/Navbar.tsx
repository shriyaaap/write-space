"use client";

import { useState } from "react";
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
  sidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const firstLetter =
    username?.charAt(0).toUpperCase() || "U";

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={
            sidebarOpen ? "Close menu" : "Open menu"
          }
          onClick={() =>
            setSidebarOpen((current) => !current)
          }
        >
          ☰
        </button>

        <Link href="/" className={styles.logo}>
          WriteSpace
        </Link>
      </div>

      <div className={styles.navbarRight}>
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
                <img
                  src={avatar}
                  alt={username || "Profile"}
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