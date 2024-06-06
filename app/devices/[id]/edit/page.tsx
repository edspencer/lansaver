import { Heading } from "@/components/heading";
import { Button } from "@/components/button";
import { PrismaClient } from "@prisma/client";

import { notFound } from "next/navigation";
import DeviceForm from "@/components/device/form";
import { updateDeviceAction } from "@/app/actions/devices";

const prisma = new PrismaClient();

export default async function EditDevicePage({ params: { id } }: { params: { id: string } }) {
  const device = await prisma.device.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!device) {
    return notFound();
  }

  console.log(device);

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
      <DeviceForm device={device} formAction={updateDeviceAction} />
      {/* <p>{state.message}</p>
      <pre>{JSON.stringify(state.error, null, 4)}</pre> */}
    </div>
  );
}
