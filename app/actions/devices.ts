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

//returns nested form data e.g. credentials[API_KEY]
function getGroupedFormData(formData: FormData, key: string) {
  const groupData: { [key: string]: any } = {};

  formData.forEach((value, dataKey) => {
    const [groupName, fieldName] = dataKey.split("[").map((str) => str.replace("]", ""));

    if (groupName === key) {
      groupData[fieldName] = value;
    }
  });

  return groupData;
}

export async function updateDeviceAction(formData: FormData): Promise<CreateDeviceAction> {
  try {
    console.log("updateDeviceAction");

    const id = Number(formData.get("id"));
    const data = getDeviceDataFromFormData(formData);
    await updateDevice(id, data);

    revalidatePath(`/devices/${id}`);
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
}

function getDeviceDataFromFormData(formData: FormData): Prisma.DeviceCreateInput {
  const credentials = getGroupedFormData(formData, "credentials");
  const config = getGroupedFormData(formData, "config");

  return {
    type: formData.get("type") as string,
    hostname: formData.get("hostname") as string,
    config: JSON.stringify(config),
    credentials: JSON.stringify(credentials),
  };
}

export async function createDeviceAction(prevState: any, formData: FormData): Promise<CreateDeviceAction> {
  try {
    console.log("createDeviceAction");

    const data = getDeviceDataFromFormData(formData);
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
