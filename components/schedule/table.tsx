"use client";

import type { Schedule } from "@prisma/client";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../common/table";

export function SchedulesTable({ schedules }: { schedules: Schedule[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Cron</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id} href={`/schedules/${schedule.id}`}>
            <TableCell className="font-medium">{schedule.name}</TableCell>
            <TableCell>{schedule.cron}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
