"use client";

import { Spinner } from "../common/spinner";
import { Button } from "../common/button";
import { deleteDeviceAction } from "../../app/actions/devices";
import { backupDeviceAction } from "../../app/actions/backups";
import { useFormStatus } from "react-dom";
import type { Device } from "@prisma/client";

import { useGenericAction, useExtendedActionState } from "@/lib/useExtendedActionState";

export function BackupDeviceForm({ device }: { device: Device }) {
  const [, formAction] = useExtendedActionState(backupDeviceAction, {}, device.id);
  return (
    <form action={formAction}>
      <BackupDeviceButton />
    </form>
  );
}

export function BackupDeviceButton() {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} color="zinc" type="submit">
      {pending ? <Spinner /> : null}
      Backup Now
    </Button>
  );
}

export function DeleteDeviceButton({ device }: { device: Device }) {
  const action = useGenericAction(deleteDeviceAction, device.id);

  return (
    <Button onClick={action} color="red">
      Delete
    </Button>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" color="dark/zinc" disabled={pending}>
      Save
    </Button>
  );
}
