import { executeJob } from "./index";
import type { Schedule, Job, Device } from "@prisma/client";
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

  it("should create a new job instance", async () => {
    expect(() => executeJob({ job, logger, jobActor, updateJob, fileSaver })).not.toThrow();
  });
});
