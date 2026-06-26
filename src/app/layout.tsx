import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

// Global SEO Metadata for SK Technologies
export const metadata: Metadata = {
  title: "SK Technologies | Electronic Components",
  description: "India's premier destination for electronic components. Fast, reliable, and authentic parts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning prevents browser extensions from breaking Next.js rendering */}
      <body className={`${inter.className} flex flex-col min-h-screen bg-white text-gray-900`} suppressHydrationWarning>
        
        {/* Main Page Content (Navbar is handled inside individual pages) */}
        <div className="grow">
          {children}
        </div>

        {/* Global Footer appears at the bottom of every page */}
        <Footer />

      </body>
    </html>
  );
}