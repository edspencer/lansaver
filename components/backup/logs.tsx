"use client";
import { Backup } from "@prisma/client";
import { useInformAI } from "inform-ai";

export const Logs = ({ logLines, backup }: { logLines: string; backup?: Backup }) => {
  useInformAI({
    name: "Logs",
    prompt: "This component displays backup logs in a monospace font",
    props: { logLines, backup },
  });

  return (
    <div className="font-mono text-sm">
      {logLines.split("\n").map((line, index) => (
        <p key={index} className={line.split(" ")[2]?.includes("error:") ? "text-red-500" : ""}>
          {line}
        </p>
      ))}
    </div>
  );
};
