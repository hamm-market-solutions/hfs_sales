"use client";

import { Button } from "@nextui-org/button";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/dropdown";
import { NavbarItem } from "@nextui-org/navbar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { matchPath, pathIncludes } from "@/utils/paths";
import { navigationTree } from "@/config/navigation";
import Icon from "@/components/atoms/icons/icon";
import { routes } from "@/config/routes";
import { isNone, unwrap, unwrapOr } from "@/utils/fp-ts";

export default function NavBarItems({
    navRoutes,
}: {
    navRoutes: typeof navigationTree;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const navBarItems = [];

    if (Object.keys(navRoutes).length === 0) {
        return;
    }

    for (const route of navRoutes) {
        const url = unwrapOr(route.url, "");

        if (isNone(route.items)) {
            navBarItems.push(
                <NavbarItem
                    key={route.key}
                    isActive={matchPath(url, pathname)}
                >
                    <Link
                        className="text-primary"
                        color="foreground"
                        href={url}
                    >
                        {route.title}
                    </Link>
                </NavbarItem>,
            );
        } else {
            const nestedNavBarItems = [];

            for (const subRoute of route.items.value) {
                const subRouteUrl = unwrapOr(subRoute.url, "");
                const subRouteDescription = unwrapOr(subRoute.description, "");
                const subRouteIcon = unwrapOr(subRoute.icon, "");

                nestedNavBarItems.push(
                    <DropdownItem
                        key={subRoute.key}
                        className={
                            matchPath(subRouteUrl, pathname) ? "bg-primary-50" : ""
                        }
                        description={subRouteDescription}
                        startContent={<Icon alt="dropdown-item-icon" src={subRouteIcon} />}
                        onPress={() => {
                            router.push(unwrap(subRoute.url));
                        }}
                    >
                        {subRoute.title}
                    </DropdownItem>,
                );
            }

            navBarItems.push(
                <Dropdown key={route.key}>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={clsx(
                                    "text-primary text-base p-0 bg-transparent data-[hover=true]:bg-transparent",
                                    pathIncludes(routes.sales.reports.base, pathname)
                                        ? "font-bold"
                                        : "",
                                )}
                                endContent={
                                    <Icon
                                        alt="arrow-down"
                                        className="w-5"
                                        src={"/assets/icons/arrow-down.svg"}
                                    />
                                }
                                radius="sm"
                            >
                                {route.title}
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label={route.title}
                        className="w-[340px]"
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        {nestedNavBarItems}
                    </DropdownMenu>
                </Dropdown>,
            );
        }
    }

    return <>{navBarItems}</>;
}
