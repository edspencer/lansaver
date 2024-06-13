import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/description-list";
import bytes from "bytes";
import { notFound } from "next/navigation";

import { Heading, Subheading } from "@/components/heading";
import { Button } from "@/components/button";

import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/table";
import { BackupDeviceForm, DeleteDeviceButton } from "@/components/device/buttons";
import Link from "next/link";

import { getDevice, getDeviceBackups } from "@/models/device";

import type { Backup } from "@prisma/client";

export default async function DevicePage({ params: { id } }: { params: { id: string } }) {
  const device = await getDevice(parseInt(id, 10));

  if (!device) {
    return notFound();
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>{device.hostname}</Heading>
        <div className="flex gap-4">
          <BackupDeviceForm device={device} />

          <Button href={`/devices/${device.id}/edit`}>Edit</Button>
          <DeleteDeviceButton device={device} />
        </div>
      </div>
      <Subheading>Configuration</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Type</DescriptionTerm>
        <DescriptionDetails>{device.type}</DescriptionDetails>

        <DescriptionTerm>Hostname</DescriptionTerm>
        <DescriptionDetails>{device.hostname}</DescriptionDetails>

        <DescriptionTerm>Credentials</DescriptionTerm>
        <DescriptionDetails>
          <Link href={`/devices/${device.id}/credentials`}>View credentials</Link>
        </DescriptionDetails>
      </DescriptionList>
      <RecentBackups deviceId={device.id} />
    </div>
  );
}

import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/16/solid";
import { DeleteBackupForm } from "@/components/backup/delete";
import BackupLogsButton from "@/components/backup/logs";

async function RecentBackups({ deviceId }: { deviceId: number }) {
  const backups = await getDeviceBackups(deviceId);

  return (
    <div className="pt-6">
      <Subheading className="mb-4">Recent Backups</Subheading>
      <Table dense>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Size</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {backups.map((backup) => (
            <BackupRow key={backup.id} backup={backup} />
          ))}
        </TableBody>
      </Table>
    </div>
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

const BackupRow = ({ backup }: { backup: Backup }) => {
  return (
    <TableRow key={backup.id} className={backup.status === "failed" ? "bg-red-100" : ""}>
      <TableCell>{backup.id}</TableCell>
      <TableCell className="font-medium">{backup.status}</TableCell>
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
