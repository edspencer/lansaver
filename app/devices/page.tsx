"use client";

import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../../components/table";
import { Heading } from "../../components/heading";
import { Button } from "../../components/button";
import type { Device } from "@prisma/client";
import useSWR from "swr";

//fetches devices from Prisma
function fetchDevices() {}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Devices() {
  const { data, error, isLoading } = useSWR("/api/devices", fetcher);

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Devices</Heading>
        <div className="flex gap-4">
          <Button href="/devices/create">Add Device</Button>
        </div>
      </div>
      {error && <div>Error loading devices</div>}
      {data && <DevicesTable devices={data} />}
      {isLoading && <Loading />}
    </div>
  );
}

function Loading() {
  return <div className="text-center py-10">Loading...</div>;
}

function DevicesTable({ devices }: { devices: Device[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Type</TableHeader>
          <TableHeader>Hostname</TableHeader>
          <TableHeader>Role</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device.id} href={`/devices/${device.id}`}>
            <TableCell className="font-medium">{device.type}</TableCell>
            <TableCell>{device.hostname}</TableCell>
            <TableCell className="text-zinc-500">{device.hostname}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
