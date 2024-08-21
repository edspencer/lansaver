import { getDevices } from "@/models/device";

import { Heading } from "@/components/common/heading";
import { Button } from "@/components/common/button";
import DevicesTable from "@/components/device/table";
import NoContentYet from "@/components/no-content-yet";

export const revalidate = 0;

export default async function Devices() {
  const devices = await getDevices();

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Devices</Heading>
        <div className="flex gap-4">
          <Button href="/devices/create">Add Device</Button>
        </div>
      </div>
      {devices.length ? <DevicesTable devices={devices} /> : null}
      <NoContentYet items={devices} href="/devices/create" message="No Devices yet" />
    </div>
  );
}
