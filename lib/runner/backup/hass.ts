import type { Device, Backup } from "@prisma/client";
import { BackupRunner } from "./index";
import https from "https";
import fetch from "node-fetch";
import BackupSaver from "../saver";

// Disable SSL verification because Home Assistant usually uses a self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Downloads the backup from Home Assistant and saves it to a file.
 */
async function downloadBackup({
  device,
  backup,
  backupActor,
  logger,
  slug,
  updateBackup,
  fileSaver,
}: {
  device: Device;
  backup: Backup;
  backupActor: any;
  logger: any;
  slug: string;
  updateBackup: any;
  fileSaver: BackupSaver;
}) {
  const { hostname, config = null } = device;
  const { API_KEY } = JSON.parse(config || "{}");

  const downloadUrl = `https://${hostname}:3000/backup/${slug}/download`;

  logger.info(`Downloading backup from ${downloadUrl}`);

  const res = await fetch(downloadUrl, {
    agent,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  logger.info(`Home Assistant responded with status code ${res.status}`);

  if (res.ok) {
    let responseText = await res.text();

    if (responseText) {
      try {
        const filename = `${backup.id}.tar`;
        logger.info(`Writing backup to ${filename}`);
        await fileSaver.save(filename, responseText);
        const bytes = await fileSaver.size(filename);

        await updateBackup(backup.id, { bytes });
        backupActor.send({ type: "COMPLETE" });
      } catch (writeError: any) {
        logger.error(`Failed to write backup: ${writeError.message}`);
        backupActor.send({ type: "FAIL" });
      }
    }
  } else {
    logger.error(`Failed to fetch backup: ${res.statusText}. Status code was ${res.status}`);
    backupActor.send({ type: "FAIL" });
  }
}

export class HomeAssistantRunner implements BackupRunner {
  //Basically just fetches the backupUrl and saves it to file, with a bunch of error handling and logging
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
    backupActor: any;
    updateBackup: any;
    fileSaver: BackupSaver;
  }): Promise<Backup> {
    logger.info("Starting Home Assistant backup");
    backupActor.send({ type: "START" });

    const { hostname, config = null } = device;
    const { API_KEY } = JSON.parse(config || "{}");

    const backupUrl = `https://${hostname}:3000/backup`;

    logger.info(`POSTing to ${backupUrl}`);

    try {
      const res = await fetch(backupUrl, {
        agent,
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      logger.info(`Home Assistant responded with status code ${res.status}`);
      if (res.ok) {
        const backupData = await res.json();
        const { slug } = backupData.data;
        logger.info(`Home Assistant backup creation response: ${JSON.stringify(backupData)}`);

        await downloadBackup({ device, backup, backupActor, logger, slug, updateBackup, fileSaver });
      } else {
        logger.error(`Failed to fetch backup: ${res.statusText}. Status code was ${res.status}`);
        backupActor.send({ type: "FAIL" });
      }
    } catch (err) {
      logger.error(`Failed to fetch backup: ${err}`);
      backupActor.send({ type: "FAIL" });
    }

    return backup;
  }
}
