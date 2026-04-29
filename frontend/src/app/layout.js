import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StockFlow - Inventory Management",
  description: "Simple inventory management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <Link href="/" className="logo">
              StockFlow
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link">
                Dashboard
              </Link>
              <Link href="/products" className="nav-link">
                Products
              </Link>
              <Link href="/branches" className="nav-link">
                Branches
              </Link>
              <Link href="/stocks" className="nav-link">
                Stocks
              </Link>
              <Link href="/movements" className="nav-link">
                Movements
              </Link>
              <Link href="/reports" className="nav-link">
                Reports
              </Link>

            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
