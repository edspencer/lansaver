import type { Schedule, Device } from "@prisma/client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Field, Label, Description, Fieldset, Legend } from "@/components/fieldset";
import { Text } from "@/components/text";
import { useFormStatus } from "react-dom";
import { Link } from "@/components/link";
import { Checkbox, CheckboxField, CheckboxGroup } from "../checkbox";

export default function ScheduleForm({
  schedule,
  formAction,
  devices,
}: {
  schedule?: Schedule;
  formAction: any;
  devices: Device[];
}) {
  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <Field>
        <Label>Name</Label>
        <Description>Give a meaningful name to the schedule</Description>
        <Input name="name" placeholder="Daily" defaultValue={schedule?.name} />
      </Field>
      <Field>
        <Label>Cron</Label>
        <Description>
          The cron string to use (Use <Link href="http://www.cronmaker.com/">cronmaker.com</Link> if you're not sure)
        </Description>
        <Input name="cron" placeholder="0 0 * * *" defaultValue={schedule?.name} />
      </Field>
      <DevicesList schedule={schedule} devices={devices} />
      <div className="flex justify-end">
        {schedule && <input type="hidden" name="id" value={schedule.id} />}
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" color="dark/zinc" disabled={pending}>
      Save
    </Button>
  );
}

function DevicesList({ schedule, devices }: { schedule?: Schedule; devices: Device[] }) {
  const scheduleDevices = schedule ? schedule.devices?.split(",") : [];
  return (
    <Fieldset>
      <Legend>Devices</Legend>
      <Text>Select the devices to run this schedule on</Text>
      <CheckboxGroup>
        {devices.map((device) => (
          <CheckboxField key={device.id}>
            <Checkbox
              name="device"
              value={String(device.id)}
              defaultChecked={scheduleDevices?.includes(String(device.id))}
            />
            <Label>{device.hostname}</Label>
          </CheckboxField>
        ))}
      </CheckboxGroup>
    </Fieldset>
  );
}
