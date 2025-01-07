import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

import NavBarItems from "./navBarItems";

import { navigatonTree } from "@/config/navigation";
import { isUserAuthenticated } from "@/lib/auth/validations";

export default async function NavBar() {
    const isUserAuth = await isUserAuthenticated();

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
            <NavbarContent justify="center">
                <NavBarItems
                    navRoutes={isUserAuth ? navigatonTree : ({} as typeof navigatonTree)}
                />
            </NavbarContent>
        </Navbar>
    );
}
