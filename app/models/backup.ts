import { Prisma, PrismaClient } from "@prisma/client";

import { DeviceSchema } from "@/app/validation";

const prisma = new PrismaClient();

export async function createBackup(deviceId: number, data: any) {
  console.log(`Creating backup for ${deviceId}`);

  return await prisma.backup.create({
    data: Object.assign(data, {
      status: "pending",
      deviceId,
    }),
  });
}
