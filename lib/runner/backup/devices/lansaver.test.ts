import { Backup, Device } from "@prisma/client";
import LANsaverBackupRunner from "./lansaver";
import BackupSaver from "../../saver";

import { exportDatabase } from "@/lib/import-export"; // Import the function to be mocked

jest.mock("@/lib/import-export"); // Mock the entire module

describe("LANsaverBackupRunner", () => {
  let runner: LANsaverBackupRunner;
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
  let mockBackupData = JSON.stringify({
    devices: [],
    backups: [],
    schedules: [],
    jobs: [],
  });

  beforeEach(() => {
    runner = new LANsaverBackupRunner();

    device = {
      id: 1,
      type: "lansaver",
      hostname: "lansaver.local",
      credentials: "",
      config: "{}",
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
      jobId: null,
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
    describe("when the database backup call is successful", () => {
      let result: Backup;

      beforeEach(async () => {
        // Mock the exportDatabase function to return a successful result
        (exportDatabase as jest.Mock).mockResolvedValueOnce(mockBackupData);

        result = await runner.startBackup({
          device,
          backup,
          logger,
          backupActor,
          updateBackup,
          fileSaver,
        });
      });

      it("should return the backup", async () => {
        expect(result).toEqual(backup);
      });

      it('should send a "START" message to the backupActor', async () => {
        expect(backupActor.send).toHaveBeenCalledWith({ type: "START" });
      });

      it("should have written some info logs", async () => {
        expect(logger.info).toHaveBeenCalled();
      });

      it("should not have added any errors to the log", async () => {
        expect(logger.error).not.toHaveBeenCalled();
      });

      it("should have updated the backup bytes", async () => {
        expect(updateBackup).toHaveBeenCalledWith(backup.id, { bytes: mockBackupData.length });
      });

      it("should have sent a 'COMPLETE' message to the backupActor", async () => {
        expect(backupActor.send).toHaveBeenCalledWith({ type: "COMPLETE" });
      });

      it("should have saved the file", async () => {
        expect(fileSaver.save).toHaveBeenCalledWith("1.json", mockBackupData);
      });
    });

    describe("if the backup fails", () => {
      beforeEach(async () => {
        // Mock the exportDatabase function to throw an error
        (exportDatabase as jest.Mock).mockRejectedValueOnce(new Error("mocked error"));

        await runner.startBackup({
          device,
          backup,
          logger,
          backupActor,
          updateBackup,
          fileSaver,
        });
      });

      it("should send a 'FAIL' message to the backupActor", () => {
        expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
        expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
      });

      it("should have written some info logs", () => {
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
