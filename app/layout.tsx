import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

import "./globals.css";
import "./home/home.css";
import "./auth/auth.css";
import "./dashboard/dashboard.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Sidebar/>
        {children}
      </body>
    </html>
  );
}