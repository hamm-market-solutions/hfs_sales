import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

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
                <div className={"container mx-auto flex flex-col min-h-screen"}>
                    <Header />
                    <main className={"flex-grow p-4"}>{children}</main>
                </div>
            </body>
        </html>
    );
}
