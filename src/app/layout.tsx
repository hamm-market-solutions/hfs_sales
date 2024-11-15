import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Header from "@/components/organism/core/header";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const getServerProps = async () => {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "/";
  const request = new NextRequest(referer);

  return {
    request: {
      referer: referer,
      path: request.nextUrl.pathname,
    },
  };
};

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
