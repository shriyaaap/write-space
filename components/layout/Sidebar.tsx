import Link from "next/link";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link href="/" className="sidebar-link">
          <span className="sidebar-icon">🏠 </span>
          <span>Home</span>
        </Link>

        <Link href="/following" className="sidebar-link">
          <span className="sidebar-icon">👥 </span>
          <span>Following</span>
        </Link>

        <Link href="/dashboard" className="sidebar-link">
          <span className="sidebar-icon">📊</span>
          <span>Dashboard</span>
        </Link>

        <Link href="/write" className="sidebar-link">
          <span className="sidebar-icon">📝 </span>
          <span>Write</span>
        </Link>

        <Link href="/search" className="sidebar-link">
          <span className="sidebar-icon">🔍</span>
          <span>Explore</span>
        </Link>
      </nav>
    </aside>
  );
}