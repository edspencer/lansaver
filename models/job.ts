import type { Job } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

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
