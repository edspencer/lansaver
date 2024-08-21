"use client";

import { Button } from "../common/button";

export function DownloadButton({ src }: { src: string }) {
  return (
    <Button
      onClick={() => {
        const blob = new Blob([src], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "lansaver-export.json";
        link.click();
        URL.revokeObjectURL(url);
      }}
    >
      Download as File
    </Button>
  );
}
