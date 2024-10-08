"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Schedule } from "@prisma/client";
import { createSchedule, deleteSchedule, getSchedule, updateSchedule } from "../../models/schedule";
import { createAndExecuteJobForSchedule } from "../../lib/service/jobs";
import { GenericServerAction } from "@/lib/useExtendedActionState";

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

export async function updateScheduleAction(prevState: any, formData: FormData): Promise<GenericServerAction> {
  try {
    console.log("updateScheduleAction");

    const id = Number(formData.get("id"));
    const data = getScheduleDataFromFormData(formData);
    await updateSchedule(id, data);

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

  return {
    success: true,
    message: "Schedule Updated Successfully",
    redirect: `/schedules/${formData.get("id")}`,
  };
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

  //get schedule from prisma
  const schedule = await getSchedule(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found",
    };
  }

  await createAndExecuteJobForSchedule({ schedule });
  revalidatePath(`/schedules/${id}`);

  return {
    success: true,
    message: "Schedule Run Successfully",
  };
}

type ServerActionResponse = {
  success: boolean;
  message: string;
  error?: any;
};
