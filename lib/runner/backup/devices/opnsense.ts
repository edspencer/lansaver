import https from "https";
import fetch from "node-fetch";

import type { Backup } from "@prisma/client";
import { BackupRunner, StartBackupArgs } from "../factory";

// Disable SSL verification because OPNSense usually uses a self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false,
});

export default class OPNSenseBackupRunner implements BackupRunner {
  async startBackup({
    device,
    backup,
    logger,
    backupActor,
    updateBackup,
    fileSaver,
  }: StartBackupArgs): Promise<Backup> {
    let responseText = null;
    backupActor.send({ type: "START" });

    try {
      logger.info("Starting OPNSense backup");

      const { hostname, credentials = null } = device;
      const { API_KEY, API_SECRET } = JSON.parse(credentials || "{}");

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

          const filename = `${backup.id}.xml`;
          logger.info(`Writing backup to ${filename}`);
          await fileSaver.save(filename, responseText);

          await updateBackup(backup.id, { bytes });
          backupActor.send({ type: "COMPLETE" });
        } catch (writeError: any) {
          logger.error(`Failed to write backup: ${writeError.message}`);
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

    return backup;
  }
}
