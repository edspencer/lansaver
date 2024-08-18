"use client";

import { toast } from "react-toastify";
import { Button } from "../common/button";

export function CopyButton({ src }: { src: string }) {
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(src);
        const toastId = toast("Copied to clipboard!", {
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          progressClassName: "w-full",
          className: "flex items-center gap-x-2 rounded-lg px-[1rem] py-[0.5rem] shadow-md bg-white",
        });
        setTimeout(() => toast.dismiss(toastId), 2000);
      }}
    >
      Copy to Clipboard
    </Button>
  );
}
