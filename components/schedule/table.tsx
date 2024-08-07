"use client";

import cronstrue from "cronstrue";
import type { Schedule } from "@prisma/client";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../common/table";
import { Button } from "../common/button";
import { PencilSquareIcon } from "@heroicons/react/16/solid";

export function SchedulesTable({ schedules }: { schedules: Schedule[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Cron</TableHeader>
          <TableHeader></TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id} href={`/schedules/${schedule.id}`}>
            <TableCell className="font-medium">{schedule.name}</TableCell>
            <TableCell>{schedule.cron}</TableCell>
            <TableCell>{cronstrue.toString(schedule.cron, { verbose: true })}</TableCell>
            <TableCell>
              <EditButton href={`/schedules/${schedule.id}/edit`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const EditButton = ({ href }: { href: string }) => {
  return (
    <Button href={href} outline title="Edit">
      <PencilSquareIcon />
    </Button>
  );
};
