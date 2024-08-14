"use client";

import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/16/solid";
import { DeleteBackupForm } from "@/components/backup/delete";
import BackupLogsButton from "@/components/backup/LogActions";
import bytes from "bytes";
import { Button } from "@/components/common/button";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/common/table";
import { Link } from "@/components/common/link";

import type { BackupWithDevice } from "@/models/backup";
import StatusBadge from "./statusbadge";
import { formatDistanceToNow } from "date-fns";

import { useInformAI } from "inform-ai";

const prompt =
  "This table displays a list of backups taken for various devices. The data will be provided to you in JSON format";

export function BackupsTable({
  name = "Backups Table",
  backups,
  showDevice = false,
  condensed = false,
}: {
  name?: string;
  backups: BackupWithDevice[];
  showDevice?: boolean;
  condensed?: boolean;
}) {
  useInformAI({
    name,
    prompt,
    props: {
      backups,
    },
  });

  if (condensed) {
    return <CondensedBackupsTable backups={backups} showDevice={showDevice} />;
  }

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>ID</TableHeader>
          {showDevice && <TableHeader>Device</TableHeader>}
          <TableHeader>Status</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Size</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {backups.map((backup) => (
          <BackupRow key={backup.id} backup={backup} showDevice={showDevice} />
        ))}
      </TableBody>
    </Table>
  );
}

const RetryButton = () => {
  return (
    <Button outline title="Retry">
      <ArrowPathIcon />
    </Button>
  );
};

const DownloadButton = () => {
  return (
    <Button outline title="Download">
      <ArrowDownTrayIcon />
    </Button>
  );
};

const BackupRow = ({ backup, showDevice = false }: { backup: BackupWithDevice; showDevice?: boolean }) => {
  return (
    <TableRow key={backup.id} className={backup.status === "failed" ? "bg-red-100" : ""}>
      <TableCell>{backup.id}</TableCell>
      {showDevice && (
        <TableCell>
          <Link href={`/devices/${backup.deviceId}`}>{backup.device?.hostname}</Link>
        </TableCell>
      )}
      <TableCell className="font-medium">
        <StatusBadge status={backup.status} />
      </TableCell>
      <TableCell>{backup.createdAt.toLocaleString("en-US", { timeZoneName: "short" })}</TableCell>
      <TableCell className="text-zinc-500">{bytes(backup.bytes ?? 0)}</TableCell>
      <TableCell className="gap-2 flex justify-end">
        {backup.status === "failed" && <RetryButton />}
        {backup.status === "completed" && <DownloadButton />}
        <BackupLogsButton backup={backup} />
        <DeleteBackupForm backup={backup} />
      </TableCell>
    </TableRow>
  );
};

export function CondensedBackupsTable({
  backups,
  showDevice = true,
}: {
  showDevice?: boolean;
  backups: BackupWithDevice[];
}) {
  return (
    <Table dense>
      <TableHead>
        <TableRow>
          {showDevice && <TableHeader>Device</TableHeader>}
          <TableHeader>Date</TableHeader>
          <TableHeader>Size</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {backups.map((backup) => (
          <CondensedBackupRow key={backup.id} backup={backup} showDevice={showDevice} />
        ))}
      </TableBody>
    </Table>
  );
}

const CondensedBackupRow = ({ backup, showDevice = false }: { backup: BackupWithDevice; showDevice?: boolean }) => {
  return (
    <TableRow key={backup.id} className={backup.status === "failed" ? "bg-red-100" : ""}>
      {showDevice && (
        <TableCell>
          <Link href={`/devices/${backup.deviceId}`}>{backup.device?.hostname}</Link>
        </TableCell>
      )}
      <TableCell>{formatDistanceToNow(backup.createdAt, { addSuffix: true })}</TableCell>
      <TableCell className="text-zinc-500">{bytes(backup.bytes ?? 0)}</TableCell>
      <TableCell className="gap-2 flex justify-end">
        {backup.status === "completed" && <DownloadButton />}
        <BackupLogsButton backup={backup} />
      </TableCell>
    </TableRow>
  );
};
