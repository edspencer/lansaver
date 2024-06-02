import type { Device } from "@prisma/client";
import { Heading } from "../heading";

export default function DeviceBackups({ device }: { device: Device }) {
  return (
    <>
      <Heading>Backups for {device.hostname}</Heading>
    </>
  );
}
