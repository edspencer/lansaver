import { Prisma } from "@prisma/client";

import DeviceSchema from "../lib/validation/device";
import { encrypt, decrypt } from "@/lib/crypto";
import prisma from "../lib/prismaClient";

export async function getDevice(id: number) {
  const device = await prisma.device.findUnique({ where: { id } });

  if (!device) {
    return null;
  }

  return { ...device, credentials: decrypt(device.credentials) };
}

export async function getDevices() {
  const devices = await prisma.device.findMany();
  return devices.map((device) => ({ ...device, credentials: decrypt(device.credentials) }));
}

export async function createDevice(data: Prisma.DeviceCreateInput) {
  DeviceSchema.parse(data);
  return await prisma.device.create({ data: encryptedData(data) });
}

export async function updateDevice(id: number, data: Prisma.DeviceUpdateInput) {
  DeviceSchema.parse(data);
  return await prisma.device.update({
    where: { id },
    data: encryptedData(data),
  });
}

export async function deleteDevice(id: number) {
  return await prisma.device.delete({ where: { id } });
}

export async function getDeviceBackups(id: number) {
  return await prisma.backup.findMany({ where: { deviceId: id }, orderBy: { createdAt: "desc" } });
}

function encryptedData(data: any) {
  return { ...data, credentials: encrypt((data.credentials || "{}") as string) };
}

export async function deleteAllDevices() {
  return await prisma.device.deleteMany({});
}
