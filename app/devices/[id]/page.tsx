import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/app/components/description-list";
import bytes from "bytes";

import { Heading, Subheading } from "@/app/components/heading";
import { Button } from "@/app/components/button";

import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/app/components/table";
import { BackupDeviceForm, DeleteDeviceButton } from "@/app/components/device/buttons";
import Link from "next/link";

import { getDevice, getDeviceBackups } from "@/app/models/device";

export default async function DevicePage({ params: { id } }: { params: { id: string } }) {
  const device = await getDevice(parseInt(id, 10));

  if (!device) {
    return <Heading>Device not found</Heading>;
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

import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/16/solid";

async function RecentBackups({ deviceId }: { deviceId: number }) {
  const backups = await getDeviceBackups(deviceId);

  return (
    <div className="pt-6">
      <Subheading className="mb-4">Recent Backups</Subheading>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Status</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Size</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {backups.map((backup) => (
            <TableRow key={backup.id}>
              <TableCell className="font-medium">{backup.status}</TableCell>
              <TableCell>
                <Link href={`/devices/${backup.id}`}>{backup.createdAt.toDateString()}</Link>
              </TableCell>
              <TableCell className="text-zinc-500">{bytes(backup.bytes ?? 0)}</TableCell>
              <TableCell className="gap-2 flex">
                <Button outline title="Download">
                  <ArrowDownTrayIcon />
                </Button>
                <Button color="red" title="Delete Backup">
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
