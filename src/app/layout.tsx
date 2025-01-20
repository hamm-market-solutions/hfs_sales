import "@/styles/globals.css";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";
import Header from "@/components/organism/core/header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen font-sans antialiased text-primary",
          fontSans.variable,
        )}
      >
        <Header />
        <main className="main-content flex flex-row justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
