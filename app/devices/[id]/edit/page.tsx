import { Heading } from "@/components/heading";
import { Button } from "@/components/button";

import { notFound } from "next/navigation";
import DeviceForm from "@/components/device/form";
import { updateDeviceAction } from "@/app/actions/devices";
import { getDevice } from "@/app/models/device";

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
      <DeviceForm device={device} formAction={updateDeviceAction} />
      {/* <p>{state.message}</p>
      <pre>{JSON.stringify(state.error, null, 4)}</pre> */}
    </div>
  );
}
