"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Schedule } from "@prisma/client";
import { createSchedule, deleteSchedule } from "@/models/schedule";

export type CreateScheduleAction = {
  success?: boolean;
  message?: string;
  schedule?: Schedule;
  error?: any;
};

function getScheduleDataFromFormData(formData: FormData) {
  return {
    name: formData.get("name") as string,
    cron: formData.get("cron") as string,
    devices: formData.getAll("device").join(","),
  };
}

export async function createScheduleAction(prevState: any, formData: FormData): Promise<CreateScheduleAction> {
  try {
    console.log("createScheduleAction");

    const data = getScheduleDataFromFormData(formData);
    const schedule = await createSchedule(data);

    revalidatePath("/schedules");

    return {
      success: true,
      message: "Schedule Created Successfully",
      schedule,
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
      message: "Failed to create schedule",
      error: JSON.stringify(error),
    };
  }
}

export async function updateScheduleAction(prevState: any, formData: FormData): Promise<CreateScheduleAction> {
  try {
    console.log("updateScheduleAction");

    //   const id = Number(formData.get("id"));
    //   const data = getDeviceDataFromFormData(formData);
    //   await updateDevice(id, data);

    //   revalidatePath(`/devices/${id}`);
  } catch (error) {
    //   console.log(`zod error: ${error instanceof ZodError}`);
    //   console.log(error);
    //   if (error instanceof ZodError) {
    //     return {
    //       success: false,
    //       message: "Validation Error",
    //       error: {
    //         issues: error.issues,
    //       },
    //     };
    //   }
    //   return {
    //     success: false,
    //     message: "Failed to update device",
    //     error: JSON.stringify(error),
    //   };
  }

  return {
    success: false,
    message: "Failed to update device",
    error: "asdf", //JSON.stringify(error),
  } as CreateScheduleAction;

  redirect(`/schedules/${formData.get("id")}`);
}

//error conditions:
// - id not supplied
// - schedule does not exist
// - could not update database
export async function deleteScheduleAction(id: number) {
  console.log(`deleting schedule ${id}`);

  //delete using prisma
  try {
    await deleteSchedule(id);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to delete schedule",
      error: JSON.stringify(error),
    };
  }

  redirect("/schedules");

  // return {
  //   success: true,
  //   message: "Schedule Deleted Successfully",
  // };
}

export async function runScheduleAction(id: number) {
  console.log(`running schedule ${id}`);
  return {
    success: true,
    message: "Schedule Run Successfully",
  };
}
