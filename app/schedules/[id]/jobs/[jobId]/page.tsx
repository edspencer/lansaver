import { Heading, Subheading } from "@/components/heading";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/description-list";
import { notFound } from "next/navigation";

import { getJob } from "@/models/job";
import { getBackupsForJob } from "@/models/backup";
import { Button } from "@/components/button";

import BackupsTable from "@/components/backup/table";

export default async function JobDetailsPage({ params: { id, jobId } }: { params: { id: string; jobId: string } }) {
  const job = await getJob(Number(jobId));
  const backups = await getBackupsForJob(Number(jobId));

  if (!job) {
    return notFound();
  }

  console.log(job);
  console.log(backups);

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Button plain href={`/schedules/${id}`}>
          &laquo; Back to Schedule
        </Button>
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
    </>
  );
}
