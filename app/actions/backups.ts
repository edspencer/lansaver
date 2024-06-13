"use server";

import { createBackupForDeviceId, deleteBackup, getBackup } from "@/models/backup";
import { revalidatePath } from "next/cache";
import { timeout } from "@/lib/timeout";

//error conditions:
// - id not supplied
// - device does not exist
// - could not read from database
// - could not start backup for some reason
export async function backupDeviceAction(id: number) {
  console.log(`backing up device ${id}`);

  //kick off the backup; if it takes more than 3 seconds we'll respond already
  const jobPromise = createBackupForDeviceId(id);
  const result = await Promise.race([jobPromise, timeout(3000)]);

  //we want to revalidate whether the backup finished yet or not
  revalidatePath(`/devices/${id}`);

  if (result === undefined) {
    //job is still running after 3 seconds, so report back progress immediately
    return {
      success: true,
      message: "Backup Started",
    };
  } else {
    //job completed

    return {
      success: true,
      message: "Backup Created Successfully",
    };
  }
}

export async function deleteBackupAction(id: number) {
  console.log(`deleting backup ${id}`);

  try {
    const backup = await getBackup(id);
    await deleteBackup(id);

    if (backup !== null) {
      revalidatePath(`/devices/${backup.deviceId}`);
    }
  } catch (e) {
    return {
      success: false,
      message: "Failed to delete backup",
      error: e,
    };
  }

  return {
    success: true,
    message: "Backup Deleted Successfully",
  };
}
