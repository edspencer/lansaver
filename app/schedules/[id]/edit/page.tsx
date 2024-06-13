import { getDevices } from "@/app/models/device";
import CreateScheduleForm from "@/components/schedule/create-form";

export default async function EditSchedulePage() {
  const devices = await getDevices();

  return <CreateScheduleForm devices={devices} />;
}
