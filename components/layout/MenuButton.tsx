"use client";

import styles from "./Navbar.module.css";

type MenuButtonProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MenuButton({
  sidebarOpen,
  setSidebarOpen,
}: MenuButtonProps) {
  return (
    <button
      className={styles.menuButton}
      aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      onClick={() => setSidebarOpen((current) => !current)}
    >
      ☰
    </button>
  );
}