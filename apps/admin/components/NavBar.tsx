import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export const NavBar = () => {
  return (
    <div className="flex justify-between m-4 p-4">
      <div>Latent</div>

      <div className="flex gap-3">
        <ThemeToggle />

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="space-x-6">
              <NavigationMenuLink asChild>
                <Link href="/docs">Events</Link>
              </NavigationMenuLink>{" "}
              <NavigationMenuLink asChild>
                <Link href="/docs">Venue</Link>
              </NavigationMenuLink>{" "}
              <NavigationMenuLink asChild>
                <Link href="/docs">Bookings</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
