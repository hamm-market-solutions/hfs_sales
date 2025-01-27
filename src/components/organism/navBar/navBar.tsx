import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";

import NavBarItems from "./navBarItems";

import { navigationTree } from "@/config/navigation";
import { isUserAuthenticated } from "@/lib/auth/validations";

export default async function NavBar(): Promise<JSX.Element> {
    const isUserAuth = await isUserAuthenticated();

    return (
        <Navbar>
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
                    navRoutes={isUserAuth ? navigationTree : ({} as typeof navigationTree)}
                />
            </NavbarContent>
        </Navbar>
    );
}
