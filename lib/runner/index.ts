import type { Device, Backup } from "@prisma/client";
import { OPNSenseBackupRunner } from "./opnsense";
import { HomeAssistantRunner } from "./hass";
import { createBackupLogger } from "./logger";
import BackupSaver from "./saver";

import type { Actor } from "xstate";
import type { Logger } from "winston";
import path from "path";

import { BackupState, backupMachine, updateBackup } from "../../app/models/backup";
import { createActor } from "xstate";

export interface BackupRunner {
  startBackup({
    device,
    backup,
    logger,
    backupActor,
    updateBackup,
    fileSaver,
  }: {
    device: Device;
    backup: Backup;
    logger: Logger;
    backupActor: Actor<any>;
    updateBackup: any;
    fileSaver: BackupSaver;
  }): Promise<Backup>;
}

/**
 * Factory class to create backup runners. Sample usage:
 *
 * const runner = BackupRunnerFactory.createBackupRunner("opnsense");
 * const outcome = await runner.startBackup(device);
 *
 * Or you can use the memoized version:
 *
 * const outcome = await BackupRunnerFactory.startBackup(device);
 */
export class BackupRunnerFactory {
  static createBackupRunner(type: string): BackupRunner {
    switch (type) {
      case "opnsense":
        return new OPNSenseBackupRunner();
      case "hass":
        return new HomeAssistantRunner();
      default:
        throw new Error(`Unsupported backup type: ${type}`);
    }
  }

  // Memoize the runners so we don't have to create a new instance every time
  static runners: { [key: string]: BackupRunner } = {};

  // Create a memoized backup runner
  static createMemoizedBackupRunner(type: string): BackupRunner {
    if (!this.runners[type]) {
      this.runners[type] = this.createBackupRunner(type);
    }

    return this.runners[type];
  }

  // convenience method to start a backup without creating a runner, logger etc
  static async startBackup({ device, backup }: { device: Device; backup: Backup }): Promise<Backup> {
    const logger = await createBackupLogger(backup.id);

    //initiate our state machine, persist state changes to the database
    const backupActor = createActor(backupMachine);
    backupActor.subscribe(async (state) => {
      logger.info(`Backup state: ${state.value}`);

      //update the backup status in the database
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
