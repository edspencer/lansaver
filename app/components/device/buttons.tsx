"use client";

// import Image from 'next/image';
// import Spinner from "../../../public/spinner.svg";

const Spinner = function () {
  return (
    <svg className="spinner" width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
        stroke="white"
      />
    </svg>
  );
};

import { Button } from "../button";
import { backupDeviceAction, deleteDeviceAction } from "../../actions/devices";
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
