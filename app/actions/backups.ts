"use server";

import { createBackupForDeviceId, deleteBackup, getBackup } from "@/app/models/backup";
import { revalidatePath } from "next/cache";

//error conditions:
// - id not supplied
// - device does not exist
// - could not read from database
// - could not start backup for some reason
export async function backupDeviceAction(id: number) {
  console.log(`backing up device ${id}`);

  await createBackupForDeviceId(id);

  revalidatePath(`/devices/${id}`);

  //wait for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    success: true,
    message: "Backup Created Successfully",
  };
}

export async function deleteBackupAction(id: number) {
  console.log(`deleting backup ${id}`);

  try {
    const backup = await getBackup(id);
    await deleteBackup(id);

    if (backup !== null) {
      revalidatePath(`/devices/${backup.deviceId}`);
    }

    //wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
