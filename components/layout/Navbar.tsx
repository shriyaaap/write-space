import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-button" aria-label="Open menu">
          ☰
        </button>

        <Link href="/" className="logo">
          WriteSpace
        </Link>
      </div>

      <div className="navbar-right">
        <Link href="/search" className="search-link">
          <span>Search</span>
        </Link>

        <Link href="/login" className="nav-link">
          Log in
        </Link>

        <Link href="/signup" className="write-button">
          Write
        </Link>
      </div>
    </header>
  );
}