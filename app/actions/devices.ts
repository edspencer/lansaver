"use server";

import { createDevice, deleteDevice } from "@/app/models/device";
import { createBackup } from "@/app/models/backup";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import type { Device } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type CreateDeviceAction = {
  success?: boolean;
  message: string;
  device?: Device;
  error?: any;
};

export async function createDeviceAction(prevState: any, formData: FormData): Promise<CreateDeviceAction> {
  try {
    const data = {
      type: formData.get("type"),
      hostname: formData.get("hostname"),
      credentials: formData.get("credentials"),
    } as Prisma.DeviceCreateInput;

    console.log(data);

    const device = await createDevice(data);

    revalidatePath("/devices");

    return {
      success: true,
      message: "Device Created Successfully",
      device,
    };
  } catch (error) {
    console.log(`zod error: ${error instanceof ZodError}`);
    console.log(error);

    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Validation Error",
        error: {
          issues: error.issues,
        },
      };
    }

    return {
      success: false,
      message: "Failed to create device",
      error: JSON.stringify(error),
    };
  }
}

//error conditions:
// - id not supplied
// - device does not exist
// - could not read from database
// - could not start backup for some reason
export async function backupDeviceAction(id: number) {
  console.log(`backing up device ${id}`);

  //wait for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  //create backup using prisma
  console.log("returning from backupDeviceAction");
  await createBackup(id, { bytes: Math.random() * 1000000 });

  return {
    success: true,
    message: "Backup Created Successfully",
  };
}

//error conditions:
// - id not supplied
// - device does not exist
// - could not update database
export async function deleteDeviceAction(id: number) {
  console.log(`deleting device ${id}`);

  //delete using prisma
  try {
    await deleteDevice(id);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to delete device",
      error: JSON.stringify(error),
    };
  }

  return {
    success: true,
    message: "Device Deleted Successfully",
  };
}

export async function updateDeviceAction() {}
