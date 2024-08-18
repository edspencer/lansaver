"use client";
import DefaultJsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { DownloadButton } from "./DownloadButton";
import { CopyButton } from "./CopyButton";

export function JsonView({ src }: { src: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <CopyButton src={src} />
        <DownloadButton src={src} />
      </div>
      <div className="h-[600px] overflow-auto rounded-md border border-slate-300">
        <DefaultJsonView src={JSON.parse(src)} />
      </div>
    </div>
  );
}
