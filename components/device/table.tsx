import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../common/table";
import type { Device } from "@prisma/client";

export default function DevicesTable({ devices }: { devices: Device[] }) {
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
