import type { Job, Schedule } from "@prisma/client";
import { createJobLogger } from "../runner/logger";
import { jobMachine, JobState } from "../stateMachines/job";
import { createActor } from "xstate";
import { updateJob, createJob } from "../../models/job";
import { createBackupForDeviceId } from "../../models/backup";
import { executeJob } from "../runner/job";

import path from "path";
import BackupSaver from "../runner/saver";

export async function createJobForSchedule({ schedule }: { schedule: Schedule }) {
  //create a new job in the database
  const job = await createJob({
    schedule: { connect: { id: schedule.id } },
    status: "pending",
  });

  //create a backup job for each device in the schedule
  const devices = schedule.devices?.split(",").map((id) => parseInt(id, 10)) || [];
  const backups = [];

  //create a new backup for each device
  for (const deviceId of devices) {
    //create a new backup in the database
    const backup = await createBackupForDeviceId(deviceId, { job: { connect: { id: job.id } } });
    backups.push(backup);
  }

  return { job, backups };
}

export async function createAndExecuteJobForSchedule({ schedule }: { schedule: Schedule }) {
  const { job, backups } = await createJobForSchedule({ schedule });

  const logger = createJobLogger(job.id);

  //initiate our state machine, persist state changes to the database
  const jobActor = createActor(jobMachine);

  jobActor.subscribe(async (state) => {
    logger.info(`Job state: ${state.value}`);

    //update the backup status in the database
    await updateJob(job.id, { status: state.value as JobState });
  });

  jobActor.start();

  const fileSaver = new BackupSaver(process.env.BACKUP_DIRECTORY || path.join(process.cwd(), "backups"));
  logger.info(`Starting job ${job.id}`);

  return await executeJob({
    job,
    logger,
    jobActor,
    updateJob,
    fileSaver,
    backups,
  });
}
