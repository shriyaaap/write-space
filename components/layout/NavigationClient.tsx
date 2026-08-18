"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type NavigationClientProps = {
  userId: string | null;
  username: string | null;
  avatar: string | null;
};

export default function NavigationClient({
  userId,
  username,
  avatar,
}: NavigationClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar
        userId={userId}
        username={username}
        avatar={avatar}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <Sidebar />
    </>
  );
}