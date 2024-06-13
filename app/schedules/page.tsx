import { Heading } from "../../components/heading";
import { Button } from "../../components/button";
import { SchedulesTable } from "@/components/schedule/table";
import { getSchedules } from "../models/schedule";

export default async function Schedules() {
  const schedules = await getSchedules();

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>Schedules</Heading>
        <div className="flex gap-4">
          <Button href="/schedules/create">Add Schedule</Button>
        </div>
      </div>
      <SchedulesTable schedules={schedules} />
    </div>
  );
}
