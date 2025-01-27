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
                <div className={"container mx-auto flex flex-col min-h-screen"}>
                    <Header />
                    <main className={"flex-grow p-6"}>{children}</main>
                </div>
            </body>
        </html>
    );
}
