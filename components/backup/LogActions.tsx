"use client";
import { Button } from "../common/button";
import { Alert, AlertTitle, AlertBody, AlertActions } from "../common/alert";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Backup } from "@prisma/client";

import { DocumentTextIcon } from "@heroicons/react/16/solid";

import { Logs } from "./Logs";

const fetchBackupLogs = async (id: number) => {
  const response = await fetch(`/api/backups/${id}/logs`);
  if (!response.ok) {
    throw new Error("Failed to fetch backup logs.");
  }
  return await response.text();
};

export default function BackupLogs({ backup }: { backup: Backup }) {
  let [isOpen, setIsOpen] = useState(false);

  const {
    data: logs,
    error,
    isLoading,
  } = useQuery({ queryKey: ["backupLogs", backup.id], queryFn: () => fetchBackupLogs(backup.id), enabled: isOpen });

  const handleDownload = () => {
    if (logs) {
      const blob = new Blob([logs], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${backup.id}.log`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Button outline title="Logs" onClick={() => setIsOpen(true)}>
        <DocumentTextIcon />
      </Button>
      <Alert open={isOpen} onClose={() => setIsOpen(false)} size="4xl">
        <AlertTitle>Backup Logs</AlertTitle>
        <AlertBody>
          {isLoading && <p>Loading...</p>}
          {error && <p>Failed to fetch backup logs.</p>}
          {logs && <Logs backup={backup} logLines={logs} />}
        </AlertBody>
        <AlertActions>
          <Button outline onClick={handleDownload}>
            Download Logs
          </Button>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </AlertActions>
      </Alert>
    </>
  );
}
