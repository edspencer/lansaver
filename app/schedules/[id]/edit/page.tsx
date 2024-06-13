import { getDevices } from "@/models/device";
import { getSchedule } from "@/models/schedule";
import EditScheduleForm from "@/components/schedule/edit-form";

import { notFound } from "next/navigation";

export default async function EditSchedulePage({ params: { id } }: { params: { id: string } }) {
  const schedule = await getSchedule(Number(id));

  if (!schedule) {
    return notFound();
  }
  const devices = await getDevices();

  return <EditScheduleForm schedule={schedule} devices={devices} />;
}
