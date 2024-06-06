"use client";

import { Spinner } from "../spinner";
import { Button } from "../button";
import { deleteDeviceAction } from "../../app/actions/devices";
import { backupDeviceAction } from "../../app/actions/backups";
import { useFormStatus } from "react-dom";
import type { Device } from "@prisma/client";

export function BackupDeviceForm({ device }: { device: Device }) {
  return (
    <form action={backupDeviceAction.bind(null, device.id)}>
      <BackupDeviceButton />
    </form>
  );
}

export function BackupDeviceButton() {
  const formState = useFormStatus();

  console.log(formState);
  const { pending } = formState;

  return (
    <Button aria-disabled={pending} color="zinc" type="submit">
      {pending ? <Spinner /> : null}
      Backup Now
    </Button>
  );
}

export function DeleteDeviceButton({ device }: { device: Device }) {
  return (
    <Button onClick={() => deleteDeviceAction(device.id)} color="red">
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
