import { Prisma, PrismaClient } from "@prisma/client";

import { DeviceSchema } from "../validation";

const prisma = new PrismaClient();

export async function getDevice(id: number) {
  return await prisma.device.findUnique({ where: { id } });
}

export async function createDevice(data: Prisma.DeviceCreateInput) {
  DeviceSchema.parse(data);
  return await prisma.device.create({ data });
}

export async function updateDevice(id: number, data: Prisma.DeviceUpdateInput) {
  DeviceSchema.parse(data);
  return await prisma.device.update({ where: { id }, data });
}

export async function deleteDevice(id: number) {
  return await prisma.device.delete({ where: { id } });
}

export async function getDeviceBackups(id: number) {
  return await prisma.backup.findMany({ where: { deviceId: id }, orderBy: { createdAt: "desc" } });
}
