import type { Device, Backup } from "@prisma/client";
import { BackupOutcome, BackupRunner } from "./index";
import https from "https";
import fetch from "node-fetch";
import { createBackupLogger } from "./logger";

const fs = require("fs");
const path = require("path");

const backupDirectory = process.env.BACKUP_DIRECTORY || path.join(process.cwd(), "backups");

// Create backups directory if it doesn't exist
try {
  fs.mkdirSync(backupDirectory, { recursive: true });
} catch (error: any) {
  console.error(`Failed to create backup directory: ${error.message}`);
}

// Disable SSL verification because Home Assistant usually uses a self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class HomeAssistantRunner implements BackupRunner {
  //Basically just fetches the backupUrl and saves it to file, with a bunch of error handling and logging
  async startBackup({ device, backup }: { device: Device; backup: Backup }): Promise<BackupOutcome> {
    const logger = await createBackupLogger(backup.id);
    let success = false;
    let bytes = 0;
    let backupData = null;
    let error = null;

    try {
      logger.info("Starting Home Assistant backup");

      const { hostname, config = null } = device;
      const { API_KEY, API_SECRET } = JSON.parse(config || "{}");

      const backupUrl = `https://${hostname}:3000/backup`;

      logger.info(`POSTing to ${backupUrl}`);

      const res = await fetch(backupUrl, {
        agent,
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      logger.info(`Home Assistant responded with status code ${res.status}`);

      if (res.ok) {
        try {
          backupData = await res.json();

          logger.info(res);
          logger.info(backupData);

          // bytes = backupData.length;
          logger.info(`Home Assistant backup creation response: ${JSON.stringify(backupData)}`);
        } catch (textError: any) {
          logger.error(`Failed to read response text: ${textError.message}`);
          error = textError;
        }
      } else {
        logger.error(`Failed to fetch backup: ${res.statusText}. Status code was ${res.status}`);
      }
    } catch (fetchError: any) {
      logger.error(`Failed to fetch backup: ${fetchError.message}`);
      error = fetchError;
    }

    // if (responseText) {
    //   try {
    //     const filePath = path.join(backupDirectory, `${backup.id}.xml`);
    //     logger.info(`Writing backup to ${filePath}`);

    //     fs.mkdirSync(path.dirname(filePath), { recursive: true });
    //     fs.writeFileSync(filePath, responseText);
    //     success = true;
    //   } catch (writeError: any) {
    //     logger.error(`Failed to write backup: ${writeError.message}`);
    //     error = writeError;
    //   }
    // }

    return {
      success,
      bytes,
      error,
    };
  }
}
