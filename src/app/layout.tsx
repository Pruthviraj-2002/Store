import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Add this import
import CartDrawer from "@/components/cart-drawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SK Technologies Store",
  description: "Your electronic components destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* 2. Drop the Cart Drawer right here */}
        <CartDrawer />
        
        {/* Your main pages render here */}
        {children}
        
      </body>
    </html>
  );
}