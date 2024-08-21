"use client";
import { useExtendedActionState } from "@/lib/useExtendedActionState";
import { updateConfigAction } from "@/app/actions/config";
import { Button } from "../common/button";

export function SettingsUploadForm() {
  const [, formAction] = useExtendedActionState(updateConfigAction, {});

  return (
    <form action={formAction} className="flex gap-4">
      <input className="" type="file" name="configFile" accept="application/json" required />
      <Button color="indigo" type="submit">
        Upload
      </Button>
    </form>
  );
}
