import type { Device, Backup } from "@prisma/client";
import { OPNSenseBackupRunner } from "./opnsense";

export interface BackupRunner {
  startBackup({ device, backup }: { device: Device; backup: Backup }): Promise<BackupOutcome>;
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

  // convenience method to start a backup without creating a runner
  static startBackup({ device, backup }: { device: Device; backup: Backup }): Promise<BackupOutcome> {
    return this.createMemoizedBackupRunner(device.type).startBackup({ device, backup });
  }
}

//represents the outcome of any given backup operation
export type BackupOutcome = {
  success: boolean;
  error?: any;
  bytes: number;
};
