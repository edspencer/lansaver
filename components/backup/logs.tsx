"use client";
import { Button } from "../button";
import { Alert, AlertTitle, AlertBody, AlertActions } from "../alert";
import { useState } from "react";
import type { Backup } from "@prisma/client";

import { DocumentTextIcon } from "@heroicons/react/16/solid";

export default function BackupLogs({ backup }: { backup: Backup }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button outline title="Logs" onClick={() => setIsOpen(true)}>
        <DocumentTextIcon />
      </Button>
      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>Backup Logs</AlertTitle>
        <AlertBody>Content</AlertBody>
        <AlertActions>
          <Button outline>Download Logs</Button>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </AlertActions>
      </Alert>
    </>
  );
}
