import Link from "next/link";
import styles from "./Navbar.module.css";
import { getSessionUserId } from "@/lib/auth/session";
import { logout } from "@/app/actions/auth";

export default async function Navbar() {
  const userId = await getSessionUserId();
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button className={styles.menuButton} aria-label="Open menu">
          ☰
        </button>

        <Link href="/" className={styles.logo}>
          WriteSpace
        </Link>
      </div>

      <div className={styles.navbarRight}>

      {userId ? (
        <>
          <form action={logout}>
            <button
              type="submit"
              className={styles.logoutButton}
            >
              Logout
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login">Log in</Link>
        </>
      )}
    </div>
    </header>
  );
}