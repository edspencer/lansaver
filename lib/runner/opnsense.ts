import type { Device, Backup } from "@prisma/client";
import { BackupRunner } from "./index";
import https from "https";
import fetch from "node-fetch";
import BackupSaver from "./saver";
import { Actor } from "xstate";

// Disable SSL verification because OPNSense usually uses a self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class OPNSenseBackupRunner implements BackupRunner {
  async startBackup({
    device,
    backup,
    logger,
    backupActor,
    updateBackup,
    fileSaver,
  }: {
    device: Device;
    backup: Backup;
    logger: any;
    backupActor: Actor<any>;
    updateBackup: any;
    fileSaver: BackupSaver;
  }): Promise<Backup> {
    let responseText = null;
    backupActor.send({ type: "START" });

    try {
      logger.info("Starting OPNSense backup");

      const { hostname, config = null } = device;
      const { API_KEY, API_SECRET } = JSON.parse(config || "{}");

      const backupUrl = `https://${hostname}/api/core/backup/download/this`;

      logger.info(`Fetching from ${backupUrl}`);

      const res = await fetch(backupUrl, {
        agent,
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")}`,
        },
      });

      logger.info(`OPNSense responded with status code ${res.status}`);

      if (res.ok) {
        try {
          responseText = await res.text();
          const bytes = responseText.length;
          logger.info(`OPNSense backup file size: ${bytes}`);
          await updateBackup(backup.id, { bytes });
        } catch (textError: any) {
          logger.error(`Failed to read response text: ${textError.message}`);
          backupActor.send({ type: "FAIL" });
        }
      } else {
        logger.error(`Failed to fetch backup: ${res.statusText}. Status code was ${res.status}`);
        backupActor.send({ type: "FAIL" });
      }
    } catch (fetchError: any) {
      logger.error(`Failed to fetch backup: ${fetchError.message}`);
      backupActor.send({ type: "FAIL" });
    }

    if (responseText) {
      try {
        const filename = `${backup.id}.xml`;
        logger.info(`Writing backup to ${filename}`);
        await fileSaver.save(filename, responseText);

        backupActor.send({ type: "COMPLETE" });
      } catch (writeError: any) {
        logger.error(`Failed to write backup: ${writeError.message}`);
        backupActor.send({ type: "FAIL" });
      }
    }

    return backup;
  }
}
