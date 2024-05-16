// -------------------------------- Import Modules ---------------------------------
// External
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Internal
import "./globals.css";
import { cn } from "@/lib/utils";

// Set the font
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Application metadata
export const metadata: Metadata = {
  title: "TriFit Store",
  description: "An E-Commerce Site with meal plans and workouts",
};

// Root Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
