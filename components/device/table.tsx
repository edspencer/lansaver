import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../common/table";
import type { Device } from "@prisma/client";

export default function DevicesTable({ className, devices }: { className?: string; devices: Device[] }) {
  return (
    <Table className={className}>
      <TableHead>
        <TableRow>
          <TableHeader>Type</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Hostname</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device.id} href={`/devices/${device.id}`}>
            <TableCell className="font-medium">{device.type}</TableCell>
            <TableCell className="font-medium">{device.name}</TableCell>
            <TableCell>{device.hostname}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
