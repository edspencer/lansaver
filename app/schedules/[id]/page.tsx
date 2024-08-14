import { getSchedule, getScheduleDevices, recentJobs } from "@/models/schedule";
import { notFound } from "next/navigation";
import type { Schedule } from "@prisma/client";

import { RunScheduleForm, DeleteScheduleButton } from "@/components/schedule/buttons";
import { Heading, Subheading } from "@/components/common/heading";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/common/description-list";
import { Button } from "@/components/common/button";
import DevicesTable from "@/components/device/table";
import { JobsTable } from "@/components/job/table";
import NoContentYet from "@/components/no-content-yet";

import { InformAI } from "inform-ai";

const prompt = `A page that shows the details of a schedule. It should show the schedule's configuration, the devices in the schedule, and recent jobs for the schedule. It should also have buttons to run the schedule, edit the schedule, and delete the schedule.`;

export default async function SchedulePage({ params: { id } }: { params: { id: string } }) {
  const schedule = await getSchedule(parseInt(id, 10));

  if (!schedule) {
    return notFound();
  }

  const devices = await getScheduleDevices(schedule.id);
  const jobs = await recentJobs(schedule.id);

  return (
    <div className="flex flex-col gap-8">
      <InformAI name="Schedule Detail Page" prompt={prompt} props={{ schedule, devices, jobs }} />
      <div className="flex w-full flex-wrap items-end justify-between">
        <Heading>Schedule Details</Heading>
        <div className="flex gap-4">
          <RunScheduleForm schedule={schedule} />

          <Button href={`/schedules/${schedule.id}/edit`}>Edit</Button>
          <DeleteScheduleButton schedule={schedule} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <ScheduleConfiguration schedule={schedule} />
        <DevicesList devices={devices} />
      </div>
      <Subheading className="mt-8 mb-2">Recent Jobs</Subheading>
      <NoContentYet items={jobs} message="No recent jobs" />
      {jobs.length ? <JobsTable jobs={jobs} /> : null}
      {/* <RecentBackups deviceId={schedule.id} /> */}
    </div>
  );
}

import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

function ScheduleConfiguration({ schedule }: { schedule: Schedule }) {
  return (
    <div className="flex-1">
      <Subheading>Configuration</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Name</DescriptionTerm>
        <DescriptionDetails>{schedule.name}</DescriptionDetails>

        <DescriptionTerm>Cron</DescriptionTerm>
        <DescriptionDetails>{schedule.cron}</DescriptionDetails>

        <DescriptionTerm>Enabled</DescriptionTerm>
        <DescriptionDetails>
          {schedule.disabled ? <XMarkIcon className="color-red-600" /> : <CheckIcon className="w-6 text-green-600" />}
        </DescriptionDetails>
      </DescriptionList>
    </div>
  );
}

function DevicesList({ devices }: { devices: any[] }) {
  return (
    <div className="flex-1">
      <Subheading>Devices in this Schedule</Subheading>
      <DevicesTable className="mt-4" devices={devices} />
    </div>
  );
}
