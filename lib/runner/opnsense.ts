import type { Device } from "@prisma/client";
import { BackupOutcome, BackupRunner } from "./index";
import https from "https";
import fetch from "node-fetch";

// Disable SSL verification because OPNSense usually uses a self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class OPNSenseBackupRunner implements BackupRunner {
  async startBackup(device: Device): Promise<BackupOutcome> {
    console.log("Starting OPNSense backup");

    const { hostname, credentials } = device;
    const { API_KEY, API_SECRET } = JSON.parse(credentials);

    console.log(`Fetching from ${hostname}`);

    const res = await fetch(`https://${hostname}/api/core/backup/download/this`, {
      agent,
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")}`,
      },
    });

    const text = await res.text();
    console.log(res.status);
    console.log(text.length);

    return {
      success: res.ok,
      message: res.statusText,
      bytes: text.length,
    };
  }
}
