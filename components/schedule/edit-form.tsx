"use client";

import type { Device, Schedule } from "@prisma/client";
import { useExtendedActionState } from "@/lib/useExtendedActionState";
import ScheduleForm from "@/components/schedule/form";
import { Button } from "@/components/common/button";
import { Heading } from "@/components/common/heading";
import { updateScheduleAction } from "@/app/actions/schedules";

export default function CreateScheduleForm({ schedule, devices }: { schedule: Schedule; devices: Device[] }) {
  const [state, formAction] = useExtendedActionState(updateScheduleAction, { success: false });

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Edit Schedule</Heading>
        <div className="flex gap-4">
          <Button href={`/schedules/${schedule.id}`} outline>
            Cancel
          </Button>
        </div>
      </div>
      <ScheduleForm schedule={schedule} formAction={formAction} devices={devices} />
      <p>{state.message}</p>
      {state.error ? <pre>{JSON.stringify(state.error, null, 4)}</pre> : null}
    </div>
  );
}
