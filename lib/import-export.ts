import prisma from "@/lib/prismaClient";

export async function exportDatabase() {
  const data = await prisma.$transaction([
    prisma.device.findMany(),
    prisma.backup.findMany(),
    prisma.schedule.findMany(),
    prisma.job.findMany(),
  ]);

  const [devices, backups, schedules, jobs] = data;

  return JSON.stringify({ devices, backups, schedules, jobs }, null, 2);
}

export async function importDatabase(data: string) {
  // delete all existing data
  await prisma.$transaction([
    prisma.device.deleteMany(),
    prisma.backup.deleteMany(),
    prisma.schedule.deleteMany(),
    prisma.job.deleteMany(),
  ]);

  const { devices, backups, schedules, jobs } = JSON.parse(data);

  await prisma.$transaction([
    prisma.device.createMany({ data: devices }),
    prisma.schedule.createMany({ data: schedules }),
    prisma.job.createMany({ data: jobs }),
    prisma.backup.createMany({ data: backups }),
  ]);
}
