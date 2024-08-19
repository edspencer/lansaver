import { notFound } from "next/navigation";
import Link from "next/link";

import { DescriptionList, DescriptionTerm as DT, DescriptionDetails as DD } from "@/components/common/description-list";
import { Heading, Subheading } from "@/components/common/heading";
import { Button } from "@/components/common/button";
import { BackupDeviceForm, DeleteDeviceButton } from "@/components/device/buttons";
import { BackupsTable } from "@/components/backup/table";

import { getDevice, getDeviceBackups, deviceHumanName } from "@/models/device";

export default async function DevicePage({ params: { id } }: { params: { id: string } }) {
  const device = await getDevice(parseInt(id, 10));
  const backups = await getDeviceBackups(Number(id));

  if (!device) {
    return notFound();
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>{deviceHumanName(device)}</Heading>
        <div className="flex gap-4">
          <BackupDeviceForm device={device} />

          <Button href={`/devices/${device.id}/edit`}>Edit</Button>
          <DeleteDeviceButton device={device} />
        </div>
      </div>
      <Subheading>Configuration</Subheading>
      <DescriptionList className="mt-4">
        <DT>Type</DT>
        <DD>{device.type}</DD>

        <DT>Name</DT>
        <DD>{device.name}</DD>

        <DT>Hostname</DT>
        <DD>{device.hostname}</DD>

        <DT>Credentials</DT>
        <DD>
          <Link href={`/devices/${device.id}/credentials`}>View credentials</Link>
        </DD>
      </DescriptionList>
      <div className="pt-6">
        <Subheading className="mb-4">Recent Backups</Subheading>
        <BackupsTable backups={backups} />
      </div>
    </div>
  );
}
