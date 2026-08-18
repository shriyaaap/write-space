"use client";

import { useState } from "react";
import { logout } from "@/app/actions/auth";

type ProfileMenuProps = {
  username: string;
  avatar: string | null;
};

export default function ProfileMenu({
  username,
  avatar,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div className="profile-menu">
      <button
        type="button"
        className="profile-button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open profile menu"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={username}
            className="profile-avatar"
          />
        ) : (
          <span className="profile-letter">
            {firstLetter}
          </span>
        )}
      </button>

      {open && (
        <div className="profile-dropdown">
          <p className="profile-name">{username}</p>

          <form action={logout}>
            <button
              type="submit"
              className="profile-logout"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}