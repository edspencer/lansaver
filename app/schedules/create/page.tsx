import { getDevices } from "@/models/device";
import CreateScheduleForm from "@/components/schedule/create-form";

export default async function CreateSchedulePage() {
  const devices = await getDevices();

  return <CreateScheduleForm devices={devices} />;
}
