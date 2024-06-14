"use client";

import type { JobsWithBackupCount } from "@/models/schedule";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../common/table";
import StatusBadge from "../backup/statusbadge";

export function JobsTable({ jobs }: { jobs: JobsWithBackupCount[] }) {
  console.log(jobs);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Job</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Finished</TableHeader>
          <TableHeader>Device count</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id} href={`/schedules/${job.scheduleId}/jobs/${job.id}`}>
            <TableCell>{job.id}</TableCell>
            <TableCell className="font-medium">
              <StatusBadge status={job.status} />
            </TableCell>
            <TableCell>{job.finishedAt?.toLocaleString()}</TableCell>
            <TableCell>{job._count.backups}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
