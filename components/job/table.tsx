"use client";

import type { Job } from "@prisma/client";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "..//table";

export function JobsTable({ jobs }: { jobs: Job[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Job</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Finished</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id} href={`/schedules/${job.scheduleId}/jobs/${job.id}`}>
            <TableCell>{job.id}</TableCell>
            <TableCell className="font-medium">{job.status}</TableCell>
            <TableCell>{job.finishedAt?.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
