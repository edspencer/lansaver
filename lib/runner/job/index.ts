import type { Job } from "@prisma/client";
import { Logger } from "winston";
import { Actor } from "xstate";

export async function executeJob({
  job,
  logger,
  jobActor,
  updateJob,
  fileSaver,
}: {
  job: Job;
  logger: Logger;
  jobActor: Actor<any>;
  updateJob: any;
  fileSaver: any;
}) {
  logger.info(`Starting job ${job.id}`);

  jobActor.send({ type: "START" });
}
