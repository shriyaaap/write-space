"use client";

import Link from "next/link";
import "./Sidebar.css";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.5V21h13V9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 21v-6h5v6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FollowingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="17"
        cy="9"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 20c.5-3.5 2.5-5.5 5.5-5.5s5 2 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.5 15c3-.5 5.5 1.5 6 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <circle
        cx="10.8"
        cy="10.8"
        r="6.8"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 16l5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <rect
        x="3.5"
        y="3.5"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="13.5"
        y="3.5"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="3.5"
        y="13.5"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="13.5"
        y="13.5"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WriteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13.5 7.5 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

type SidebarProps = {
  userId?: string | null;
  isOpen?: boolean;
};

export default function Sidebar({ userId, isOpen = true }: SidebarProps) {
  const pathname = usePathname();

  // If user is not logged in or sidebar toggle is closed, don't render anything
  if (!userId || !isOpen) {
    return null;
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link href="/" className={`sidebar-link ${pathname === "/" ? "active" : ""}`}>
          <HomeIcon />
          <span>Home</span>
        </Link>

        <Link
          href="/following"
          className={`sidebar-link ${
            pathname === "/following" ? "active" : ""
          }`}
        >
          <FollowingIcon />
          <span>Following</span>
        </Link>

        <Link
          href="/dashboard"
          className={`sidebar-link ${
            pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/write"
          className={`sidebar-link ${
            pathname === "/write" ? "active" : ""
          }`}
        >
          <WriteIcon />
          <span>Write</span>
        </Link>

        <Link
          href="/search"
          className={`sidebar-link ${
            pathname === "/search" ? "active" : ""
          }`}
        >
          <SearchIcon />
          <span>Explore</span>
        </Link>
      </nav>
    </aside>
  );
}