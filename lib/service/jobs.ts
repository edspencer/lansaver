import { Job } from "@prisma/client";
import { createJobLogger } from "../runner/logger";
import { jobMachine, JobState } from "../stateMachines/job";
import { createActor } from "xstate";
import { updateJob } from "../../models/job";
import { executeJob } from "../runner/job";

import path from "path";
import BackupSaver from "../runner/saver";

export async function startJob({ job }: { job: Job }) {
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
  });
}
