import type { Metadata } from "next";
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
        <main className="flex flex-row justify-center gap-1 p-1">
          {children}
        </main>
      </body>
    </html>
  );
}
