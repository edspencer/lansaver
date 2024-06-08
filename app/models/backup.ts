import { PrismaClient } from "@prisma/client";
import { getDevice } from "./device";
import { BackupRunnerFactory } from "../../lib/runner";
import { logLocationForBackup } from "../../lib/runner/logger";

import fs from "fs";

const prisma = new PrismaClient();

export async function createBackupForDeviceId(deviceId: number) {
  console.log(`Creating backup for ${deviceId}`);

  const device = await getDevice(deviceId);

  if (!device) {
    throw new Error("Device does not exist");
  }

  const backup = await prisma.backup.create({
    data: {
      status: "pending",
      device: {
        connect: {
          id: device.id,
        },
      },
    },
  });

  const backupData = await BackupRunnerFactory.startBackup({ device, backup });

  await prisma.backup.update({
    where: {
      id: backup.id,
    },
    data: {
      status: backupData.success ? "completed" : "failed",
      bytes: backupData.bytes,
    },
  });

  return backup;
}

export async function deleteBackup(id: number) {
  //delete the log file
  const logFilePath = logLocationForBackup(id);
  try {
    fs.unlinkSync(logFilePath);
    console.log(`Deleted log file for backup ${id}`);
  } catch (e) {
    console.error(`Failed to delete log file for backup ${id}}`);
    console.error(e);
  }

  //delete the backup files

  return await prisma.backup.delete({ where: { id } });
}

export async function getBackup(id: number) {
  return await prisma.backup.findUnique({ where: { id } });
}
