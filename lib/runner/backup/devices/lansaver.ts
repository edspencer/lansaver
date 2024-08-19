import { Device, Backup } from "@prisma/client";
import { Logger } from "winston";
import { Actor } from "xstate";
import BackupSaver from "../../saver";
import { BackupRunner } from "../factory";
import { exportDatabase } from "@/lib/import-export";

export default class LANsaverBackupRunner implements BackupRunner {
  async startBackup({
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
  }): Promise<Backup> {
    backupActor.send({ type: "START" });

    try {
      logger.info("Starting LANsaver backup");
      const data = await exportDatabase();
      const bytes = data.length;
      logger.info(`LANsaver backup file size: ${bytes}`);

      const filename = `${backup.id}.json`;
      logger.info(`Writing backup to ${filename}`);
      await fileSaver.save(filename, data);

      backupActor.send({ type: "COMPLETE" });
      updateBackup(backup.id, { bytes });
      return backup;
    } catch (error) {
      backupActor.send({ type: "FAIL" });
      logger.error(error);
    }

    return backup;
  }
}
