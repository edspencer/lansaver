"use client";

import { Spinner } from "../common/spinner";
import { Button } from "../common/button";
import { deleteScheduleAction, runScheduleAction } from "../../app/actions/schedules";
import { useFormStatus } from "react-dom";
import type { Schedule } from "@prisma/client";

export function RunScheduleForm({ schedule }: { schedule: Schedule }) {
  return (
    <form action={runScheduleAction.bind(null, schedule.id)}>
      <RunScheduleButton />
    </form>
  );
}

export function RunScheduleButton() {
  const formState = useFormStatus();

  console.log(formState);
  const { pending } = formState;

  return (
    <Button aria-disabled={pending} color="zinc" type="submit">
      {pending ? <Spinner /> : null}
      Run Now
    </Button>
  );
}

export function DeleteScheduleButton({ schedule }: { schedule: Schedule }) {
  return (
    <Button onClick={() => deleteScheduleAction(schedule.id)} color="red">
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
