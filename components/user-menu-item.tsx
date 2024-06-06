import { Dropdown, DropdownButton, DropdownMenu } from "./dropdown";

import { ChevronUpIcon } from "@heroicons/react/16/solid";
import SignOutButton from "./signout-button";

import { auth } from "@/auth";
import { Avatar } from "./avatar";
import { SidebarItem } from "./sidebar";

export default async function UserMenuItem() {
  const session = await auth();

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <span className="flex min-w-0 items-center gap-3">
          <Avatar src={session?.user?.image} className="size-10" square alt="" />
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {session?.user?.name}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {session?.user?.email ?? "Loading..."}
            </span>
          </span>
        </span>
        <ChevronUpIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-64" anchor="top start">
        <SignOutButton />
      </DropdownMenu>
    </Dropdown>
  );
}
