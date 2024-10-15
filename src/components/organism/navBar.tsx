"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Icon from "../atoms/icon";

import { matchPath, pathIncludes } from "@/utils/paths";
import { navigatonTree } from "@/config/navigation";
import { routes } from "@/config/routes";

export default function NavBar() {
  const pathname = usePathname();
  const navBarItems = [];

  // if (await isUserAuthenticated()) {
  for (const [route, name] of Object.entries(navigatonTree)) {
    if (typeof name === "string") {
      navBarItems.push(
        <NavbarItem key={route} isActive={matchPath(name, pathname)}>
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
            onPress={() => (location.href = subName.url)}
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
                  pathIncludes(routes.sales.report.base, pathname)
                    ? "font-bold"
                    : "",
                )}
                endContent={
                  <Icon
                    alt="arrow-down"
                    className="w-6"
                    src={"/assets/icons/arrow-down.png"}
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
  // }

  return (
    <Navbar isBordered>
      <NavbarBrand className="gap-3">
        <Link href="/dashboard">
          <Image
            alt="logo"
            className="rounded-none"
            src="/assets/logo.png"
            width={150}
          />
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">{navBarItems}</NavbarContent>
    </Navbar>
  );
}
