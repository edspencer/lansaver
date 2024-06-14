"use client";

import { Heading } from "../../components/common/heading";
import { Button } from "../../components/common/button";
import DevicesTable from "@/components/device/table";
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
