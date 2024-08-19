import type { Device, Backup } from "@prisma/client";
import { createBackupLogger } from "../logger";
import BackupSaver from "../saver";
import runnerRegistry from "./registry";

import type { Actor } from "xstate";
import type { Logger } from "winston";
import path from "path";
import { updateBackup } from "../../../models/backup";
import { BackupState, backupMachine } from "../../stateMachines/backup";
import { createActor } from "xstate";

export type StartBackupArgs = {
  device: Device;
  backup: Backup;
  logger: Logger;
  backupActor: Actor<any>;
  updateBackup: any;
  fileSaver: BackupSaver;
};

export interface BackupRunner {
  startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver }: StartBackupArgs): Promise<Backup>;
}

export class BackupRunnerFactory {
  private static runners: { [key: string]: BackupRunner } = {};

  static createBackupRunner(type: string): BackupRunner {
    const runner = runnerRegistry[type.toLowerCase()];
    if (!runner) {
      throw new Error(`Unsupported backup type: ${type}`);
    }
    return runner;
  }

  static createMemoizedBackupRunner(type: string): BackupRunner {
    if (!this.runners[type.toLowerCase()]) {
      this.runners[type.toLowerCase()] = this.createBackupRunner(type);
    }

    return this.runners[type.toLowerCase()];
  }

  static async startBackup({
    device,
    backup,
    jobLogger,
  }: {
    device: Device;
    backup: Backup;
    jobLogger?: Logger;
  }): Promise<Backup> {
    const logger = await createBackupLogger(backup.id, jobLogger);

    const backupActor = createActor(backupMachine);
    backupActor.subscribe(async (state) => {
      logger.info(`Backup state: ${state.value}`);

      await updateBackup(backup.id, { status: state.value as BackupState });
    });

    backupActor.start();

    const fileSaver = new BackupSaver(process.env.BACKUP_DIRECTORY || path.join(process.cwd(), "backups"));

    return this.createMemoizedBackupRunner(device.type).startBackup({
      device,
      backup,
      logger,
      backupActor,
      updateBackup,
      fileSaver,
    });
  }
}
