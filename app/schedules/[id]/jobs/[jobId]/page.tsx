import { Heading, Subheading } from "@/components/common/heading";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/common/description-list";
import { notFound } from "next/navigation";

import { getJob } from "@/models/job";
import { getBackupsForJob } from "@/models/backup";
import { Button } from "@/components/common/button";
import { getJobLogs } from "@/lib/runner/logger";

import BackupsTable from "@/components/backup/table";
import { Logs } from "@/components/backup/logs";
import { TextLink } from "@/components/common/text";

export default async function JobDetailsPage({ params: { id, jobId } }: { params: { id: string; jobId: string } }) {
  const job = await getJob(Number(jobId));
  const backups = await getBackupsForJob(Number(jobId));
  const logs = await getJobLogs(jobId);

  if (!job) {
    return notFound();
  }

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <TextLink href={`/schedules/${id}`}>&laquo; Schedule</TextLink>
        <div className="flex gap-4">
          {/* <RunScheduleForm schedule={schedule} />

<Button href={`/schedules/${schedule.id}/edit`}>Edit</Button>
<DeleteScheduleButton schedule={schedule} /> */}
        </div>
      </div>
      <Heading>Job Details</Heading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>{job.status}</DescriptionDetails>

        <DescriptionTerm>Started</DescriptionTerm>
        <DescriptionDetails>{job.startedAt?.toLocaleString()}</DescriptionDetails>

        <DescriptionTerm>Finished</DescriptionTerm>
        <DescriptionDetails>{job.finishedAt?.toLocaleString()}</DescriptionDetails>
      </DescriptionList>
      <div className="pt-6">
        <Subheading className="mb-4">Backups in this Job</Subheading>
        <BackupsTable backups={backups} showDevice={true} />
      </div>
      <div className="pt-6">
        <Subheading className="mb-4">Logs</Subheading>
        <Logs logLines={logs} />
      </div>
    </>
  );
}
