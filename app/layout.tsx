import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import Providers from "./providers";

export const metadata: Metadata = {
  title: "LANsaver",
  description: "Saves your LAN configurations",
};

import { Avatar } from "../components/avatar";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer, NavbarDivider, NavbarLabel } from "../components/navbar";
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from "../components/sidebar";
import { StackedLayout } from "../components/stacked-layout";
import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon } from "@heroicons/react/16/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

import SignOutButton from "../components/signout-button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Devices", href: "/devices" },
  { label: "Schedules", href: "/schedules" },
  { label: "Backups", href: "/backups" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackedLayout
          navbar={
            <Navbar>
              <NavbarItem href="/">
                <Avatar src="/logo-small.png" />
                <NavbarLabel>LANsaver</NavbarLabel>
              </NavbarItem>
              <NavbarDivider className="max-lg:hidden" />
              <NavbarSection className="max-lg:hidden">
                {navItems.map(({ label, href }) => (
                  <NavbarItem key={label} href={href} current>
                    {label}
                  </NavbarItem>
                ))}
              </NavbarSection>
              <NavbarSpacer />
              <NavbarSection>
                <NavbarItem href="/about" aria-label="About">
                  <QuestionMarkCircleIcon />
                </NavbarItem>
                <NavbarItem href="/settings" aria-label="Settings">
                  <Cog8ToothIcon />
                </NavbarItem>
                <NavbarItem href="/logout" aria-label="Help">
                  <ArrowRightStartOnRectangleIcon />
                </NavbarItem>
              </NavbarSection>
            </Navbar>
          }
          sidebar={
            <Sidebar>
              <SidebarHeader>
                <SidebarItem href="/">
                  <Avatar src="/logo-small.png" />
                  <SidebarLabel>LANsaver</SidebarLabel>
                </SidebarItem>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  {navItems.map(({ label, href }) => (
                    <SidebarItem key={label} href={href}>
                      {label}
                    </SidebarItem>
                  ))}
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          }
        >
          <Providers>{children}</Providers>
        </StackedLayout>
      </body>
    </html>
  );
}
