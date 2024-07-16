import { Heading } from "@/components/common/heading";
import { Button } from "@/components/common/button";

import { notFound } from "next/navigation";
import { EditForm } from "@/components/device/form";
import { getDevice } from "@/models/device";

export default async function EditDevicePage({ params: { id } }: { params: { id: string } }) {
  const device = await getDevice(Number(id));

  if (!device) {
    return notFound();
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Edit {device.hostname}</Heading>
        <div className="flex gap-4">
          <Button href={`/devices/${id}`} outline>
            Cancel
          </Button>
        </div>
      </div>
      <EditForm device={device} />
    </div>
  );
}
