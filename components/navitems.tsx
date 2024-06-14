"use client";

import { usePathname } from "next/navigation";
import { NavbarItem } from "./common/navbar";
import { SidebarItem } from "./common/sidebar";

export function NavLinks({ items }: { items: { label: string; href: string }[] }) {
  const path = usePathname();

  return (
    <>
      {items.map(({ label, href }) => (
        <NavbarItem key={label} href={href} current={isCurrentPath(href, path)}>
          {label}
        </NavbarItem>
      ))}
    </>
  );
}

export function SidebarLinks({ items }: { items: { label: string; href: string }[] }) {
  const path = usePathname();

  return (
    <>
      {items.map(({ label, href }) => (
        <SidebarItem key={label} href={href} current={isCurrentPath(href, path)}>
          {label}
        </SidebarItem>
      ))}
    </>
  );
}

const isCurrentPath = (href: string, path: string): boolean => {
  if (href === "/") {
    return path === "/";
  }
  return path.startsWith(href);
};
