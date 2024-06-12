import type { Device, Backup } from "@prisma/client";
import { BackupRunner } from "./index";
import fetch from "node-fetch";
import BackupSaver from "./saver";

/**
 * Gets the _tid_ token from the TPLink device by sending a login request to /data/login.json.
 */
async function getAuthToken({
  hostname,
  username,
  password,
  logger,
}: {
  hostname: string;
  username: string;
  password: string;
  logger: any;
}): Promise<string | false> {
  const loginUrl = `http://${hostname}/data/login.json`;

  logger.info(`Logging in via from ${loginUrl}`);

  let loginRes;
  try {
    loginRes = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, operation: "write" }),
    });

    logger.info(`TPLink responded with status code ${loginRes.status}`);
  } catch (e) {
    logger.error(`Failed to fetch backup: ${e}`);
    return false;
  }

  if (!loginRes.ok) {
    logger.error(`Failed to fetch backup: ${loginRes.statusText}. Status code was ${loginRes.status}`);
    return false;
  }

  let authToken;
  try {
    const loginData = await loginRes.json();

    authToken = loginData.data["_tid_"];
  } catch (e) {
    logger.error(`Failed to parse login response: ${e}`);
    return false;
  }

  return authToken;
}

/**
 * Destroys the session by sending a POST request to /data/logout.json.
 * This way we don't leave the session hanging around.
 */
async function destroySession({ hostname, logger, authToken }: { hostname: string; logger: any; authToken: string }) {
  logger.info(`Destroying session at ${hostname}`);

  const logoutUrl = `http://${hostname}/data/logout.json`;

  logger.info(`Logging out via ${logoutUrl}`);

  let logoutRes;
  try {
    logoutRes = await fetch(logoutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _tid_: authToken }),
    });

    logger.info(`TPLink responded with status code ${logoutRes.status}`);
  } catch (e) {
    logger.error(`Failed to fetch backup: ${e}`);
    return false;
  }
}

export class TPLinkRunner implements BackupRunner {
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
    logger.info("Starting TP Link backup");
    backupActor.send({ type: "START" });

    const { hostname, config = null } = device;
    const { username, password } = JSON.parse(config || "{}");

    const authToken = await getAuthToken({ hostname, username, password, logger });

    if (!authToken) {
      backupActor.send({ type: "FAIL" });
      return backup;
    }

    const backupUrl = `http://${hostname}/data/sysConfigBackup.cfg?operation=write&unit_id=0&_tid_=${authToken}&usrLvl=3`;

    logger.info(`Fetching from ${backupUrl}`);

    let backupRes;
    try {
      backupRes = await fetch(backupUrl);

      if (backupRes.ok) {
        const responseText = await backupRes.text();
        const bytes = responseText.length;

        const filename = `${backup.id}.cfg`;
        logger.info(`Writing backup to ${filename}`);
        await fileSaver.save(filename, responseText);

        await updateBackup(backup.id, { bytes });
        backupActor.send({ type: "COMPLETE" });
      } else {
        logger.error(`Failed to fetch backup: ${backupRes.statusText}. Status code was ${backupRes.status}`);
        backupActor.send({ type: "FAIL" });
      }
    } catch (e) {
      logger.error(`Failed to fetch backup: ${e}`);
      backupActor.send({ type: "FAIL" });
      return backup;
    }

    logger.info(`TPLink responded with status code ${backupRes.status}`);

    await destroySession({ hostname, logger, authToken });

    return backup;
  }
}
