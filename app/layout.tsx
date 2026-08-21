import "./globals.css";
import "./home/home.css";
import "./auth/auth.css";
import "./dashboard/dashboard.css";
import Navigation from "@/components/layout/Navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />

        {children}
      </body>
    </html>
  );
}