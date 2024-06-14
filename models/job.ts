import type { Job } from "@prisma/client";
import { Prisma } from "@prisma/client";

import prisma from "../lib/prismaClient";

export async function getJob(id: number) {
  return await prisma.job.findUnique({ where: { id } });
}

export async function updateJob(id: number, data: Partial<Job>) {
  return await prisma.job.update({
    where: { id },
    data,
  });
}

export async function createJob(data: Prisma.JobCreateInput) {
  return await prisma.job.create({
    data,
  });
}

export async function getJobsForSchedule(scheduleId: number) {
  return await prisma.job.findMany({ where: { scheduleId } });
}
