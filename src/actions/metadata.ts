import { appConfig } from "@/config/app";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const getMetadata = (): Metadata => {
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
        host: appConfig.url,
      }
    };
};