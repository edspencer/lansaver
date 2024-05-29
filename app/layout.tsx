import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LANsaver",
  description: "Saves your LAN configurations",
};

import { Avatar } from "./components/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./components/dropdown";
import { SidebarLayout } from "./components/sidebar-layout";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "./components/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "./components/sidebar";
import * as Headless from "@headlessui/react";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from "@heroicons/react/20/solid";

import SignOutButton from "./components/signout-button";
import UserMenuItem from "./components/user-menu-item";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarLayout
          navbar={
            <Navbar>
              <NavbarSpacer />
              <NavbarSection>
                <NavbarItem href="/search" aria-label="Search">
                  <MagnifyingGlassIcon />
                </NavbarItem>
                <NavbarItem href="/inbox" aria-label="Inbox">
                  <InboxIcon />
                </NavbarItem>
                <Dropdown>
                  <DropdownButton as={NavbarItem}>
                    <Avatar src="/profile-photo.jpg" square />
                  </DropdownButton>
                  <DropdownMenu className="min-w-64" anchor="bottom end">
                    <DropdownItem href="/my-profile">
                      <UserIcon />
                      <DropdownLabel>My profile</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/settings">
                      <Cog8ToothIcon />
                      <DropdownLabel>Settings</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/privacy-policy">
                      <ShieldCheckIcon />
                      <DropdownLabel>Privacy policy</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/share-feedback">
                      <LightBulbIcon />
                      <DropdownLabel>Share feedback</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/logout">
                      <ArrowRightStartOnRectangleIcon />
                      <DropdownLabel>Sign out</DropdownLabel>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarSection>
            </Navbar>
          }
          sidebar={
            <Sidebar>
              <SidebarHeader>
                <Dropdown>
                  <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                    <Avatar src="/logo-small.png" />
                    <SidebarLabel>LANsaver</SidebarLabel>
                    <ChevronDownIcon />
                  </DropdownButton>
                  <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                    <DropdownItem href="/teams/1/settings">
                      <Cog8ToothIcon />
                      <DropdownLabel>Settings</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/teams/1">
                      <Avatar slot="icon" src="/logo-small.png" />
                      <DropdownLabel>Tailwind Labs</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/teams/2">
                      <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white " />
                      <DropdownLabel>Workcation</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/teams/create">
                      <PlusIcon />
                      <DropdownLabel>New team&hellip;</DropdownLabel>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/">
                    <HomeIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/devices">
                    <Square2StackIcon />
                    <SidebarLabel>Devices</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/schedules">
                    <TicketIcon />
                    <SidebarLabel>Schedules</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/settings">
                    <Cog6ToothIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem href="/backups">
                    <MegaphoneIcon />
                    <SidebarLabel>Backups</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
              <SidebarFooter className="max-lg:hidden">
                <UserMenuItem />
              </SidebarFooter>
            </Sidebar>
          }
        >
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
