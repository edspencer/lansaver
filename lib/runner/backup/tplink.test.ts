import { Backup, Device } from "@prisma/client";
import { TPLinkRunner } from "./tplink";
import BackupSaver from "../saver";

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");
jest.mock("node-fetch");

describe("TPLinkBackupRunner", () => {
  let runner: TPLinkRunner;
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
  const username = "admin";
  const password = "admin";

  beforeEach(() => {
    runner = new TPLinkRunner();

    device = {
      id: 1,
      type: "hass",
      hostname: "homeassistant.local",
      credentials: JSON.stringify({ username, password }),
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
    describe("with valid credentials", () => {
      const authToken = "authToken";
      const configText = "<backup>data</backup>";

      beforeEach(async () => {
        (fetch as jest.MockedFunction<typeof fetch>)
          //mocks the request to get an auth token
          .mockResolvedValueOnce(new Response(JSON.stringify({ data: { _tid_: authToken } }), { status: 200 }));
      });

      describe("fetching an auth token", () => {
        it("should send the credentials in the correct format", async () => {
          await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });

          expect(fetch).toHaveBeenCalledWith(`http://${device.hostname}/data/login.json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, operation: "write" }),
          });
        });
      });

      describe("fetching the config backup", () => {
        describe("when the request is successful", () => {
          beforeEach(async () => {
            (fetch as jest.MockedFunction<typeof fetch>)
              //mocks the request to download the backup
              .mockResolvedValueOnce(new Response(configText, { status: 200 }));

            await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });
          });

          it("should send a 'START' message to the backupActor", async () => {
            expect(backupActor.send).toHaveBeenCalledWith({ type: "START" });
          });

          it("should have written some info logs", async () => {
            expect(logger.info).toHaveBeenCalled();
          });

          it("should request a backup from the correct URL", async () => {
            expect(fetch).toHaveBeenCalledWith(
              `http://${device.hostname}/data/sysConfigBackup.cfg?operation=write&unit_id=0&_tid_=${authToken}&usrLvl=3`
            );
          });

          it("should send a 'COMPLETE' message to the backupActor", async () => {
            expect(backupActor.send).toHaveBeenCalledWith({ type: "COMPLETE" });
          });

          it("should update the backup with the correct bytes", async () => {
            expect(updateBackup).toHaveBeenCalledWith(backup.id, { bytes: configText.length });
          });

          it("should save the backup to file", async () => {
            expect(fileSaver.save).toHaveBeenCalledWith("1.cfg", "<backup>data</backup>");
          });

          it("should log out", async () => {
            expect(fetch).toHaveBeenCalledWith(`http://${device.hostname}/data/logout.json`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _tid_: authToken }),
            });
          });
        });

        describe("when the request fails", () => {
          beforeEach(async () => {
            (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
              new Response("Unauthorized", { status: 401 })
            );

            await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });
          });

          it("should log an error", async () => {
            expect(logger.error).toHaveBeenCalledWith("Failed to fetch backup: Unauthorized. Status code was 401");
          });

          it("should send a 'FAIL' message to the backupActor", async () => {
            expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
          });

          it("should not update the backup bytes", async () => {
            expect(updateBackup).not.toHaveBeenCalled();
          });

          it("should not save the backup to file", async () => {
            expect(fileSaver.save).not.toHaveBeenCalled();
          });

          it("should log out", async () => {
            expect(fetch).toHaveBeenCalledWith(`http://${device.hostname}/data/logout.json`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _tid_: authToken }),
            });
          });
        });
      });
    });

    describe("with invalid credentials", () => {
      beforeEach(async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
          new Response("Unauthorized", { status: 401 })
        );
      });

      it("should log an error", async () => {
        await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });

        expect(logger.error).toHaveBeenCalledWith("Failed to fetch backup: Unauthorized. Status code was 401");
      });

      it("should send a 'FAIL' message to the backupActor", async () => {
        await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });

        expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
      });
    });

    describe("with a network error on auth", () => {
      beforeEach(async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error("Network error"));
      });

      it("should log an error", async () => {
        await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });

        expect(logger.error).toHaveBeenCalledWith("Failed to fetch backup: Error: Network error");
      });

      it("should send a 'FAIL' message to the backupActor", async () => {
        await runner.startBackup({ device, backup, logger, backupActor, updateBackup, fileSaver });

        expect(backupActor.send).toHaveBeenCalledWith({ type: "FAIL" });
      });
    });
  });
});
