import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header";

export const metadata: Metadata = {
  title: "HFS Sales",
  description: "HFS Sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="flex flex-col justify-center gap-1">
          {children}
        </main>
      </body>
    </html>
  );
}
