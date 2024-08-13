import { Prisma } from "@prisma/client";
import type { Device, Job } from "@prisma/client";

import prisma from "../lib/prismaClient";
import ScheduleSchema from "@/lib/validation/schedule";

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
  ScheduleSchema.parse(data);
  return await prisma.schedule.update({ where: { id }, data });
}

export async function deleteSchedule(id: number) {
  return await prisma.schedule.delete({ where: { id } });
}

export type JobsWithBackupCount = Job & { _count: { backups: number } };

export async function recentJobs(id: number): Promise<JobsWithBackupCount[]> {
  return await prisma.job.findMany({
    where: { scheduleId: id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: {
          backups: true,
        },
      },
    },
  });
}

export async function deleteAllSchedules() {
  return await prisma.schedule.deleteMany({});
}
