import type { Device } from "@prisma/client";

export function createBackup({ device }: { device: Device }) {
  console.log(`Creating backup for ${device.hostname}`);
}
