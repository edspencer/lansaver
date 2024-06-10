import { Backup, Prisma, PrismaClient } from "@prisma/client";
import { getDevice } from "./device";
import { BackupRunnerFactory } from "../../lib/runner";
import { logLocationForBackup } from "../../lib/runner/logger";

import fs from "fs";

import { createMachine } from "xstate";

export enum BackupState {
  Pending = "pending",
  Started = "started",
  Completed = "completed",
  Failed = "failed",
}

export const backupMachine = createMachine({
  id: "backup",
  initial: BackupState.Pending,
  states: {
    [BackupState.Pending]: {
      on: {
        START: BackupState.Started,
        FAIL: BackupState.Failed,
      },
    },
    [BackupState.Started]: {
      on: {
        COMPLETE: BackupState.Completed,
        FAIL: BackupState.Failed,
      },
    },
    [BackupState.Completed]: {
      type: "final",
    },
    [BackupState.Failed]: {
      type: "final",
    },
  },
});

const prisma = new PrismaClient();

export async function updateBackup(backupId: number, data: Prisma.BackupUpdateInput) {
  return await prisma.backup.update({
    where: {
      id: backupId,
    },
    data,
  });
}

export async function createBackupForDeviceId(deviceId: number) {
  console.log(`Creating backup for ${deviceId}`);

  const device = await getDevice(deviceId);

  if (!device) {
    throw new Error("Device does not exist");
  }

  const backup = await prisma.backup.create({
    data: {
      status: BackupState.Pending,
      device: {
        connect: {
          id: device.id,
        },
      },
    },
  });

  return await BackupRunnerFactory.startBackup({ device, backup });
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
