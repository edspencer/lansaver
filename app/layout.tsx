import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import Providers from "./providers";

export const metadata: Metadata = {
  title: "LANsaver",
  description: "Saves your LAN configurations",
};

import { Avatar } from "../components/common/avatar";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
  NavbarDivider,
  NavbarLabel,
} from "../components/common/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../components/common/sidebar";
import { StackedLayout } from "../components/common/stacked-layout";
import { ArrowRightStartOnRectangleIcon, Cog8ToothIcon } from "@heroicons/react/16/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignOutButton from "../components/common/signout-button";
import { NavLinks, SidebarLinks } from "@/components/navitems";

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
                <NavLinks items={navItems} />
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
                  <SidebarLinks items={navItems} />
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          }
        >
          <Providers>{children}</Providers>
          <ToastContainer />
        </StackedLayout>
      </body>
    </html>
  );
}
