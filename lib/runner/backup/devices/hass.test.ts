import { Backup, Device } from "@prisma/client";
import HomeAssistantRunner from "./hass";
import BackupSaver from "../../saver";

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch");

describe("HomeAssistantBackupRunner", () => {
  let runner: HomeAssistantRunner;
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
  const API_KEY = "HASS_API_KEY";
  const slug = "ioegernerg";

  beforeEach(() => {
    runner = new HomeAssistantRunner();

    device = {
      id: 1,
      type: "hass",
      hostname: "homeassistant.local",
      config: JSON.stringify({ API_KEY }),
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
      jobId: null,
    };

    updateBackup = jest.fn();
    logger = {
      info: jest.fn(),
      // info: jest.fn((msg) => console.log(msg)),
      error: jest.fn(),
    };

    backupActor = {
      send: jest.fn(({ type }) => {
        // console.log(type);
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("startBackup", () => {
    describe("when the request to start the Home Assistant backup is successful", () => {
      let result: Backup;

      async function startBackup() {
        result = await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });

        // Wait for next tick - if we don't do this we get weird behavior due to waiting for res.json() to resolve
        await new Promise(setImmediate);
      }

      beforeEach(async () => {
        (fetch as jest.MockedFunction<typeof fetch>)
          //mocks the request to initiate the backup
          .mockResolvedValueOnce(new Response(JSON.stringify({ data: { slug } }), { status: 200 }));
      });

      it("should make the second fetch call", async () => {
        await startBackup();
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      describe("when the download request succeeds", () => {
        beforeEach(async () => {
          //mocks the request to download the backup
          (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
            new Response("tar file data", { status: 200 })
          );
        });

        it("should send a 'START' message to the backupActor", async () => {
          await startBackup();
          expect(backupActor.send).toHaveBeenCalledWith({ type: "START" });
        });

        it("should have written some info logs", async () => {
          await startBackup();
          expect(logger.info).toHaveBeenCalled();
        });

        it("should not have written any error logs", async () => {
          await startBackup();
          expect(logger.error).not.toHaveBeenCalled();
        });

        describe("and the file can be saved", () => {
          beforeEach(async () => {
            fileSaver.size = jest.fn().mockResolvedValue(13);

            await startBackup();
          });

          it("should save the file", async () => {
            expect(fileSaver.save).toHaveBeenCalledWith(`${backup.id}.tar`, "tar file data");
          });

          it('should send a "COMPLETE" message to the backupActor', async () => {
            expect(backupActor.send).toHaveBeenCalledWith({ type: "COMPLETE" });
          });

          it("should not have written any error logs", async () => {
            expect(logger.error).not.toHaveBeenCalled();
          });

          it("should have updated the backup bytes", async () => {
            expect(updateBackup).toHaveBeenCalledWith(backup.id, { bytes: 13 });
          });
        });

        describe("and the file cannot be saved", () => {
          beforeEach(async () => {
            fileSaver.save = jest.fn().mockRejectedValue(new Error("Save error"));

            await startBackup();
          });

          it('should send a "FAIL" message to the backupActor', async () => {
            expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
          });

          it("should have written an error log", async () => {
            expect(logger.error).toHaveBeenCalled();
          });

          it("should not have updated the backup bytes", async () => {
            expect(updateBackup).not.toHaveBeenCalled();
          });
        });
      });

      describe("when the download request fails", () => {
        beforeEach(async () => {
          (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
            new Response("Not found", { status: 200 })
          );

          await startBackup();
        });

        it('should send a "FAIL" message to the backupActor', async () => {
          expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
        });

        it("should have written an error log", async () => {
          expect(logger.error).toHaveBeenCalled();
        });

        it("should not have updated the backup bytes", async () => {
          expect(updateBackup).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when the request to start the Home Assistant backup fails", () => {
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
