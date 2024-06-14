import type { Device } from "@prisma/client";
import { Heading } from "../common/heading";

export default function DeviceBackups({ device }: { device: Device }) {
  return (
    <>
      <Heading>Backups for {device.hostname}</Heading>
    </>
  );
}
