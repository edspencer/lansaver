import { OPNSenseBackupRunner } from "../../lib/runner/opnsense";
import { BackupOutcome } from "../../lib/runner";
import type { Device, Backup } from "@prisma/client";
import fetch from "node-fetch";
import fs from "fs";

jest.mock("../../lib/runner/logger", () => ({
  createBackupLogger: jest.fn().mockResolvedValue({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

const { Response } = jest.requireActual("node-fetch");

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
  Response: jest.requireActual("node-fetch").Response,
}));
jest.mock("fs", () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdir: jest.fn(),
}));

describe("OPNSenseBackupRunner", () => {
  let runner: OPNSenseBackupRunner;
  let device: Device;
  let backup: Backup;

  beforeEach(() => {
    runner = new OPNSenseBackupRunner();
    device = {
      id: 123,
      hostname: "test-opnsense.local",
      credentials: JSON.stringify({ API_KEY: "test-api-key", API_SECRET: "test-api-secret" }),
      type: "OPNSense",
      config: "",
    };
    backup = {
      id: 1,
      deviceId: 123,
      createdAt: new Date(),
      status: "pending",
      bytes: null,
    };
  });

  it("should successfully fetch and write backup", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response("<backup>data</backup>", { status: 200 })
    );

    const outcome: BackupOutcome = await runner.startBackup({ device, backup });

    expect(outcome.success).toBe(true);
    expect(outcome.bytes).toBeGreaterThan(0);
    expect(outcome.error).toBeNull();
  });

  it("should handle fetch failure", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error("Fetch error"));

    const outcome: BackupOutcome = await runner.startBackup({ device, backup });

    expect(outcome.success).toBe(false);
    expect(outcome.bytes).toBe(0);
    expect(outcome.error).not.toBeNull();
  });

  it("should handle non-200 response", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response("Unauthorized", { status: 401 }));

    const outcome: BackupOutcome = await runner.startBackup({ device, backup });

    expect(outcome.success).toBe(false);
    expect(outcome.bytes).toBe(0);
    expect(outcome.error).toBeNull();
  });

  it("should handle response text reading error", async () => {
    const textError = new Error("Text reading error");
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      status: 200,
      ok: true,
      text: jest.fn().mockRejectedValue(textError),
    } as any);

    const outcome: BackupOutcome = await runner.startBackup({ device, backup });

    expect(outcome.success).toBe(false);
    expect(outcome.bytes).toBe(0);
    expect(outcome.error).toBe(textError);
  });

  it("should handle file writing error", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response("<backup>data</backup>", { status: 200 })
    );

    const writeError = new Error("Write error");
    (fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>).mockImplementation(() => {
      throw writeError;
    });

    const outcome: BackupOutcome = await runner.startBackup({ device, backup });

    expect(outcome.success).toBe(false);
    expect(outcome.bytes).toBeGreaterThan(0);
    expect(outcome.error).toBe(writeError);
  });
});
