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

    jest.clearAllMocks();
  });

  describe("startBackup", () => {
    describe("when the fetch from OPNsense is successful", () => {
      let result: Backup;

      beforeEach(async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
          new Response("<backup>data</backup>", { status: 200 })
        );

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

// import { OPNSenseBackupRunner } from "./opnsense";
// import { Backup, Device } from "@prisma/client";
// import { createBackupLogger } from "./logger";
// import { BackupState, updateBackup } from "../../app/models/backup";
// import fetch from "node-fetch";
// import fs from "fs";
// import path from "path";

// jest.mock("node-fetch");
// jest.mock("fs");
// jest.mock("./logger");
// jest.mock("../../app/models/backup", () => {
//   const actual = jest.requireActual("../../app/models/backup");
//   return {
//     ...actual,
//     updateBackup: jest.fn(),
//   };
// });
// jest.mock("xstate", () => {
//   const actual = jest.requireActual("xstate");
//   return {
//     ...actual,
//     createMachine: jest.fn(() => ({
//       subscribe: jest.fn(),
//       start: jest.fn(),
//       send: jest.fn(),
//     })),
//     createActor: jest.fn(() => ({
//       subscribe: jest.fn(),
//       start: jest.fn(),
//       send: jest.fn(),
//     })),
//   };
// });

// const { Response } = jest.requireActual("node-fetch");

// const backupDirectory = process.env.BACKUP_DIRECTORY || path.join(process.cwd(), "backups");

// describe("OPNSenseBackupRunner", () => {
//   let backupRunner: OPNSenseBackupRunner;
//   let device: Device;
//   let backup: Backup;

//   beforeEach(() => {
//     backupRunner = new OPNSenseBackupRunner();

//     device = {
//       id: 1,
//       type: "opnsense",
//       hostname: "opnsense.local",
//       config: JSON.stringify({
//         API_KEY: "test-key",
//         API_SECRET: "test-secret",
//       }),
//       credentials: "{",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     backup = {
//       id: 1,
//       deviceId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       status: "pending",
//       bytes: 0,
//     };

//     jest.clearAllMocks();
//   });

//   it("should successfully fetch and save a backup", async () => {
//     (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
//       new Response("<backup>data</backup>", { status: 200 })
//     );

//     (fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>).mockImplementation(() => {});

//     await backupRunner.startBackup({ device, backup });

//     expect(fetch).toHaveBeenCalledWith(
//       "https://opnsense.local/api/core/backup/download/this",
//       expect.objectContaining({
//         method: "GET",
//         headers: {
//           Authorization: `Basic ${Buffer.from(`test-key:test-secret`).toString("base64")}`,
//         },
//       })
//     );

//     expect(fs.writeFileSync).toHaveBeenCalledWith(
//       path.join(backupDirectory, `${backup.id}.xml`),
//       "<backup>data</backup>"
//     );

//     expect(updateBackup).toHaveBeenCalledWith(backup.id, { status: "completed", bytes: 17 });
//   });

//   it("should handle fetch errors", async () => {
//     (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error("Fetch error"));

//     await backupRunner.startBackup({ device, backup });

//     expect(fetch).toHaveBeenCalled();
//     expect(updateBackup).toHaveBeenCalledWith(backup.id, { status: "failed" });
//   });

//   it("should handle non-200 response status", async () => {
//     (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
//       new Response(null, { status: 500, statusText: "Internal Server Error" })
//     );

//     await backupRunner.startBackup({ device, backup });

//     expect(fetch).toHaveBeenCalled();
//     expect(updateBackup).toHaveBeenCalledWith(backup.id, { status: "failed" });
//   });

//   it("should handle response text read errors", async () => {
//     (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(null, { status: 200 }));

//     const mockText = jest.fn().mockRejectedValue(new Error("Text read error"));
//     (Response.prototype.text as jest.Mock).mockImplementation(mockText);

//     await backupRunner.startBackup({ device, backup });

//     expect(fetch).toHaveBeenCalled();
//     expect(mockText).toHaveBeenCalled();
//     expect(updateBackup).toHaveBeenCalledWith(backup.id, { status: "failed" });
//   });

//   it("should handle write file errors", async () => {
//     (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
//       new Response("<backup>data</backup>", { status: 200 })
//     );

//     (fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>).mockImplementation(() => {
//       throw new Error("Write error");
//     });

//     await backupRunner.startBackup({ device, backup });

//     expect(fetch).toHaveBeenCalled();
//     expect(fs.writeFileSync).toHaveBeenCalled();
//     expect(updateBackup).toHaveBeenCalledWith(backup.id, { status: "failed" });
//   });
// });
