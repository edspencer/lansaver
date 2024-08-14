"use client";
import { useRouter } from "next/navigation";

export function Redirect({ url, message }: { url: string; message?: string }) {
  const router = useRouter();

  setTimeout(() => {
    router.push(url);
  }, 10);

  return message ? <div>{message}</div> : null;
}
