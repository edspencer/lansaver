import { DropdownItem, DropdownLabel } from "./dropdown";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";

import { signOut } from "@/auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
