"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";

import { routes } from "@/config/routes";
import { matchPath } from "@/utils/matchPath";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Navbar isBordered>
      <NavbarBrand className="gap-3">
        <Image
          alt="logo"
          className="rounded-none"
          src="/assets/logo.png"
          width={120}
        />
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem isActive={matchPath(routes.dashboard, pathname)}>
          <Link
            className="text-primary"
            color="foreground"
            href={routes.dashboard}
          >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem
          isActive={matchPath(
            routes.sales.report["[countryId]"].forecast,
            pathname,
          )}
        >
          <Link
            className="text-primary"
            color="foreground"
            href={routes.dashboard}
          >
            Forecast
          </Link>
        </NavbarItem>
      </NavbarContent>
      {/* <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent> */}
    </Navbar>
  );
}
