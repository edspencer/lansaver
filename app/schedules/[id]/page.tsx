import { getSchedule, getScheduleDevices } from "@/app/models/schedule";
import { notFound } from "next/navigation";

import { RunScheduleForm, DeleteScheduleButton } from "@/components/schedule/buttons";
import { Heading, Subheading } from "@/components/heading";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/description-list";
import { Button } from "@/components/button";
import DevicesTable from "@/components/device/table";

export default async function SchedulePage({ params: { id } }: { params: { id: string } }) {
  const schedule = await getSchedule(parseInt(id, 10));

  if (!schedule) {
    return notFound();
  }

  const devices = await getScheduleDevices(schedule.id);

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Schedule Details</Heading>
        <div className="flex gap-4">
          <RunScheduleForm schedule={schedule} />

          <Button href={`/schedules/${schedule.id}/edit`}>Edit</Button>
          <DeleteScheduleButton schedule={schedule} />
        </div>
      </div>
      <Subheading>Configuration</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Name</DescriptionTerm>
        <DescriptionDetails>{schedule.name}</DescriptionDetails>

        <DescriptionTerm>Cron</DescriptionTerm>
        <DescriptionDetails>{schedule.cron}</DescriptionDetails>

        <DescriptionTerm>Enabled</DescriptionTerm>
        <DescriptionDetails>{schedule.disabled}</DescriptionDetails>
      </DescriptionList>
      <Subheading className="mt-8 mb-2">Devices in this Schedule</Subheading>
      <DevicesTable devices={devices} />
      {/* <RecentBackups deviceId={schedule.id} /> */}
    </div>
  );
}
