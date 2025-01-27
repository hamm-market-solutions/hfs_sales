import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export function getMetadata(): Metadata {
    return {
        title: {
            default: siteConfig.name,
            template: `%s - ${siteConfig.name}`,
        },
        description: siteConfig.description,
        icons: {
            icon: "/favicon.ico",
        },
        other: {
            appUrl: process.env.APP_URL!
        }
    };
}