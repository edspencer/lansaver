import type { Job, Backup } from "@prisma/client";
import { Logger } from "winston";
import { Actor } from "xstate";
import { BackupRunnerFactory } from "../backup";
import { getDevice } from "@/models/device";

export async function executeJob({
  job,
  logger,
  jobActor,
  updateJob,
  fileSaver,
  backups,
}: {
  job: Job;
  logger: Logger;
  jobActor: Actor<any>;
  updateJob: any;
  fileSaver: any;
  backups: Backup[];
}) {
  logger.info(`Starting job ${job.id}`);

  jobActor.send({ type: "START" });
  await updateJob(job.id, { startedAt: new Date() });

  //run each backup
  for (const backup of backups) {
    const device = await getDevice(backup.deviceId);

    if (!device) {
      logger.error(`Device not found for backup ${backup.id}`);
      continue;
    }

    await BackupRunnerFactory.startBackup({ device, backup, jobLogger: logger });
  }

  await updateJob(job.id, { finishedAt: new Date() });
}
