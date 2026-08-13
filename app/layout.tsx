import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import "./home/home.css";
import "./article/article.css";
import "./auth/auth.css";
import "./dashboard/dashboard.css";
import Sidebar from "@/components/layout/Sidebar";


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