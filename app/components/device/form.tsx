"use client";
import type { Device } from "@prisma/client";
import { SubmitButton } from "@/app/components/device/buttons";

import { Input } from "@/app/components/input";
import { Select } from "@/app/components/select";
import { Field, Label, Description } from "@/app/components/fieldset";

export default function DeviceForm({ device, formAction }: { device?: Device; formAction: any }) {
  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <Field>
        <Label>Device Type</Label>
        <Select name="type">
          <option value="opnsense">OPNSense</option>
          <option value="hass">Home Assistant</option>
          <option value="tplink">TP Link Managed Switch</option>
        </Select>
      </Field>
      <Field>
        <Label>Hostname</Label>
        <Description>Host name or IP address of the server to back up</Description>
        <Input name="hostname" placeholder="http://192.168.1.1" defaultValue={device?.hostname} />
      </Field>
      <Field>
        <Label>Credentials</Label>
        <Description>This makes no sense</Description>
        <Input name="credentials" placeholder="okcool" defaultValue={device?.credentials} />
      </Field>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
