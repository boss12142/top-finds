import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Top Finds Store | Best Deals & Trending Products",
  description: "Discover the best trending products on Amazon. Curated top picks, honest reviews, and the best deals — all in one place.",
  keywords: ["amazon deals", "best products", "trending gadgets", "product reviews", "top finds"],
  openGraph: {
    title: "Top Finds Store | Best Deals & Trending Products",
    description: "Discover the best trending products on Amazon. Curated top picks and honest reviews.",
    type: "website",
    url: "https://top-finds.store",
    siteName: "Top Finds Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Finds Store",
    description: "Discover the best trending products on Amazon.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://top-finds.store",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo">
              <span className="logo-icon">🔥</span>
              <span className="logo-text">Top Finds</span>
            </a>
            <nav>
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/links">Latest Picks</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="footer">
          <p className="footer-disclosure">
            As an Amazon Associate, I earn from qualifying purchases. 
            Product prices and availability are accurate as of the date/time indicated 
            and are subject to change. Any price and availability information displayed 
            on Amazon at the time of purchase will apply.
          </p>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/links">Latest Picks</a>
          </div>
          <p className="footer-copyright">© 2026 Top Finds Store. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
