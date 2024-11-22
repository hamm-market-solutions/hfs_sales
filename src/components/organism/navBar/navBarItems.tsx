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
import { navigatonTree } from "@/config/navigation";
import Icon from "@/components/atoms/icons/icon";
import { routes } from "@/config/routes";

export default function NavBarItems({
  navRoutes,
}: {
  navRoutes: typeof navigatonTree;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const navBarItems = [];

  for (const route of navRoutes) {
    if (route.items === undefined) {
      navBarItems.push(
        <NavbarItem key={route.key} isActive={matchPath(route.url, pathname)}>
          <Link className="text-primary" color="foreground" href={name}>
            {route}
          </Link>
        </NavbarItem>,
      );
    } else {
      let nestedNavBarItems = [];

      for (const [subRoute, subName] of Object.entries(name)) {
        nestedNavBarItems.push(
          <DropdownItem
            key={subRoute}
            className={matchPath(subName.url, pathname) ? "bg-primary-50" : ""}
            description={subName.description}
            startContent={<Icon alt="dropdown-item-icon" src={subName.icon} />}
            onPress={() => {
              router.push(subName.url);
            }}
          >
            {subName.title}
          </DropdownItem>,
        );
      }

      navBarItems.push(
        <Dropdown key={route}>
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
                {route}
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label={route}
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
