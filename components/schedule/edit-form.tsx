"use client";

import type { Device } from "@prisma/client";
import { useFormState } from "react-dom";
import ScheduleForm from "@/components/schedule/form";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { updateScheduleAction } from "@/app/actions/schedules";

export default function CreateScheduleForm({ devices }: { devices: Device[] }) {
  const [state, formAction] = useFormState(updateScheduleAction, {});

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Edit Schedule</Heading>
        <div className="flex gap-4">
          <Button href="/schedules" outline>
            Cancel
          </Button>
        </div>
      </div>
      <ScheduleForm formAction={formAction} devices={devices} />
      <p>{state.message}</p>
      {state.error ? <pre>{JSON.stringify(state.error, null, 4)}</pre> : null}
    </div>
  );
}
