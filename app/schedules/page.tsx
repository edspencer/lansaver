import { Heading } from "@/components/common/heading";
import { Button } from "@/components/common/button";
import { SchedulesTable } from "@/components/schedule/table";
import { getSchedules } from "@/models/schedule";
import NoContentYet from "@/components/no-content-yet";

export const revalidate = 0;

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

      {schedules.length ? <SchedulesTable schedules={schedules} /> : null}
      <NoContentYet items={schedules} message="No Schedules yet" href="/schedules/create" />
    </div>
  );
}
