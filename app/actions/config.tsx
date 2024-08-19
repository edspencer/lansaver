"use server";

import type { GenericServerAction } from "@/lib/useExtendedActionState";
import { importDatabase } from "@/lib/import-export";
import { revalidatePath } from "next/cache";

export async function updateConfigAction(
  prevState: GenericServerAction,
  formData: FormData
): Promise<GenericServerAction> {
  try {
    console.log("updateConfigAction");

    const file = formData.get("configFile") as File;
    const fileText = await file.text();

    await importDatabase(fileText);

    //clear all caches as we just overwrote the database
    revalidatePath("/");
  } catch (error) {
    console.error("Error importing database");
    console.error(error);

    return {
      success: false,
      message: "Failed to update config",
      error: JSON.stringify(error),
    };
  }

  return {
    success: true,
    message: "Config Updated Successfully",
  };
}
