import { Prisma, PrismaClient } from "@prisma/client";
import type { Device } from "@prisma/client";

// import { DeviceSchema } from "../validation";

const prisma = new PrismaClient();

export async function getSchedules() {
  return await prisma.schedule.findMany();
}

export async function getSchedule(id: number) {
  return await prisma.schedule.findUnique({ where: { id } });
}

export async function createSchedule(data: Prisma.ScheduleCreateInput) {
  return await prisma.schedule.create({ data });
}

export async function getScheduleDevices(id: number): Promise<Device[]> {
  const schedule = await getSchedule(id);

  if (!schedule) {
    return [];
  }

  return await prisma.device.findMany({ where: { id: { in: schedule.devices?.split(",").map((i) => Number(i)) } } });
}

export async function updateSchedule(id: number, data: Prisma.ScheduleUpdateInput) {
  return await prisma.schedule.update({ where: { id }, data });
}

export async function deleteSchedule(id: number) {
  return await prisma.schedule.delete({ where: { id } });
}

export async function runSchedule(id: number) {}
