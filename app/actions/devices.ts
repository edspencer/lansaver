"use server";

import { createDevice, deleteDevice, updateDevice } from "@/app/models/device";

import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import type { Device } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateDeviceAction = {
  success?: boolean;
  message: string;
  device?: Device;
  error?: any;
};

export async function updateDeviceAction(formData: FormData): Promise<CreateDeviceAction> {
  try {
    console.log("updateDeviceAction");
    console.log(formData);
    // console.log(prevState);

    const data = {
      id: Number(formData.get("id")),
      type: formData.get("type") as string,
      hostname: formData.get("hostname") as string,
      credentials: formData.get("credentials") as string,
    };

    console.log("updating device");
    console.log(data);

    const device = await updateDevice(data.id, data);

    revalidatePath(`/devices/${data.id}`);
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
      message: "Failed to update device",
      error: JSON.stringify(error),
    };
  }

  redirect(`/devices/${formData.get("id")}`);

  // return {
  //   success: true,
  //   message: "Device Updated Successfully",
  //   device,
  // };
}

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
