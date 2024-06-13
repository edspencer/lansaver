import { executeJob } from "./index";
import type { Schedule, Job, Device, Backup } from "@prisma/client";
import BackupSaver from "../saver";

describe("startJob", () => {
  let updateJob: any;
  let logger: any;
  let jobActor: any;
  let fileSaver: BackupSaver = {
    save: jest.fn(),
    size: jest.fn(),
    backupDirectory: "path/to/backup/directory",
  };

  const firewallDevice: Device = {
    id: 1,
    type: "opnsense",
    hostname: "firewall.local",
    credentials: JSON.stringify({}),
    config: "{}",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const switchDevice: Device = {
    id: 2,
    type: "tplink",
    hostname: "switch.local",
    credentials: JSON.stringify({}),
    config: "{}",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const schedule: Schedule = {
    id: 1,
    name: "My Schedule",
    cron: "0 0 * * *",
    devices: [firewallDevice, switchDevice].map((d) => d.id).join(","),
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const job: Job = {
    id: 1,
    scheduleId: schedule.id,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    startedAt: null,
    finishedAt: null,
  };

  const backups: Backup[] = [];

  beforeEach(() => {
    updateJob = jest.fn();
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    jobActor = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start the job", async () => {
    await executeJob({ job, logger, jobActor, updateJob, fileSaver, backups });

    expect(logger.info).toHaveBeenCalledWith(`Starting job ${job.id}`);
    expect(jobActor.send).toHaveBeenCalledWith({ type: "START" });
  });

  it("should set the Job startedAt field to the current date", async () => {
    await executeJob({ job, logger, jobActor, updateJob, fileSaver, backups });

    expect(updateJob).toHaveBeenCalledWith(job.id, expect.objectContaining({ startedAt: expect.any(Date) }));
  });

  // it("should set the Job finishedAt field to the current date", async () => {
  //   await executeJob({ job, logger, jobActor, updateJob, fileSaver });

  //   expect(updateJob).toHaveBeenCalledWith(job.id, expect.objectContaining({ finishedAt: expect.any(Date) }));
  // });

  // describe("the backup jobs", () => {
  //   it.todo("should start each backup");
  // });

  // describe("if each of the backups succeeds", () => {
  //   it.todo("should set the job status to complete");
  // });

  // describe("if any of the backups fail", () => {
  //   it.todo("should set the job status to failed");
  // });
});
