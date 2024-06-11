import { Backup, Device } from "@prisma/client";
import { OPNSenseBackupRunner } from "./opnsense";
import BackupSaver from "./saver";

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch");

describe("OPNSenseBackupRunner", () => {
  let runner: OPNSenseBackupRunner;
  let device: Device;
  let backup: Backup;
  let fileSaver: BackupSaver = {
    save: jest.fn(),
    size: jest.fn(),
    backupDirectory: "path/to/backup/directory",
  };
  let updateBackup: Function;
  let logger: any;
  let backupActor: any;
  const API_KEY = "OPNSENSE_API_KEY";
  const API_SECRET = "OPNSENSE_API_SECRET";

  beforeEach(() => {
    runner = new OPNSenseBackupRunner();

    device = {
      id: 1,
      type: "opnsense",
      hostname: "opnsense.local",
      config: JSON.stringify({ API_KEY, API_SECRET }),
      credentials: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    backup = {
      id: 1,
      deviceId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
      bytes: 0,
    };

    updateBackup = jest.fn();
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    backupActor = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("startBackup", () => {
    describe("when the fetch from OPNsense is successful", () => {
      let result: Backup;

      beforeEach(() => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
          new Response("<backup>data</backup>", { status: 200 })
        );
      });

      describe("and the file can be saved", () => {
        beforeEach(async () => {
          result = await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });
        });

        it('should send a "START" message to the backupActor', async () => {
          expect(backupActor.send).toHaveBeenCalledWith({ type: "START" });
        });

        it("should have written some info logs", async () => {
          expect(logger.info).toHaveBeenCalled();
        });

        it("should request a backup from the correct URL", async () => {
          expect(fetch).toHaveBeenCalledWith(
            `https://${device.hostname}/api/core/backup/download/this`,
            expect.objectContaining({
              method: "GET",
              headers: {
                Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")}`,
              },
            })
          );
        });

        it("should not have added any errors to the log", async () => {
          expect(logger.error).not.toHaveBeenCalled();
        });

        it("should have sent a 'COMPLETE' message to the backupActor", async () => {
          expect(backupActor.send).toHaveBeenCalledWith({ type: "COMPLETE" });
        });

        it("should have updated the backup bytes", async () => {
          expect(updateBackup).toHaveBeenCalledWith(backup.id, { bytes: 21 });
        });

        it("should have saved the file", async () => {
          expect(fileSaver.save).toHaveBeenCalledWith("1.xml", "<backup>data</backup>");
        });

        it("should return the backup", async () => {
          expect(result).toEqual(backup);
        });
      });

      describe("when the file cannot be saved", () => {
        beforeEach(async () => {
          (fileSaver.save as jest.Mock).mockRejectedValue(new Error("File save error"));

          result = await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });
        });

        it("should send a 'FAIL' message to the backupActor", async () => {
          expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
        });

        it("should have written some info logs", async () => {
          expect(logger.info).toHaveBeenCalled();
        });

        it("should have added an error to the log", async () => {
          expect(logger.error).toHaveBeenCalled();
        });

        it('should not have sent a "COMPLETE" message to the backupActor', async () => {
          expect(backupActor.send).not.toHaveBeenCalledWith({ type: "COMPLETE" });
        });

        it("should not have updated the backup bytes", async () => {
          expect(updateBackup).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when the fetch request fails", () => {
    let result: Backup;

    beforeEach(async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error("Fetch error"));

      result = await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });
    });

    it('should send a "START" message to the backupActor', async () => {
      expect(backupActor.send).toHaveBeenCalledWith({ type: "START" });
    });

    it("should have written some info logs", async () => {
      expect(logger.info).toHaveBeenCalled();
    });

    it("should have added an error to the log", async () => {
      expect(logger.error).toHaveBeenCalled();
    });

    it("should have sent a 'FAIL' message to the backupActor", async () => {
      expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
    });

    it("should not have updated the backup bytes", async () => {
      expect(updateBackup).not.toHaveBeenCalled();
    });

    it("should not have saved the file", async () => {
      expect(fileSaver.save).not.toHaveBeenCalled();
    });

    it("should return the backup", async () => {
      expect(result).toEqual(backup);
    });
  });
});
