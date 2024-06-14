"use client";
import type { Device } from "@prisma/client";
import { SubmitButton } from "@/components/device/buttons";

import { useState } from "react";

import { Input } from "@/components/common/input";
import { Select } from "@/components/common/select";
import { Field, Label, Description } from "@/components/common/fieldset";

export default function DeviceForm({ device, formAction }: { device?: Device; formAction: any }) {
  const [type, setType] = useState(device?.type || "opnsense");

  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <Field>
        <Label>Device Type</Label>
        <Select name="type" defaultValue={type} onChange={(e) => setType(e.target.value)}>
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
      {type === "opnsense" && <OPNSenseFields device={device} />}
      {type === "hass" && <HomeAssistantFields device={device} />}
      {type === "tplink" && <TPLinkFields device={device} />}
      <div className="flex justify-end">
        {device && <input type="hidden" name="id" value={device.id} />}
        <SubmitButton />
      </div>
    </form>
  );
}

function OPNSenseFields({ device }: { device?: Device }) {
  const credentials = JSON.parse(device?.credentials || "{}");

  return (
    <>
      <Field>
        <Label>API Key</Label>
        <Input name="credentials[API_KEY]" placeholder="API KEY" defaultValue={credentials["API_KEY"]} />
      </Field>
      <Field>
        <Label>API Secret</Label>
        <Input name="credentials[API_SECRET]" placeholder="API SECRET" defaultValue={credentials["API_SECRET"]} />
      </Field>
    </>
  );
}

function TPLinkFields({ device }: { device?: Device }) {
  const credentials = JSON.parse(device?.credentials || "{}");

  return (
    <>
      <Field>
        <Label>API Key</Label>
        <Input name="credentials[username]" placeholder="username" defaultValue={credentials.username} />
      </Field>
      <Field>
        <Label>API Secret</Label>
        <Input name="credentials[password]" placeholder="password" defaultValue={credentials.password} />
      </Field>
    </>
  );
}

function HomeAssistantFields({ device }: { device?: Device }) {
  const credentials = JSON.parse(device?.credentials || "{}");
  const config = JSON.parse(device?.config || "{}");

  return (
    <>
      <Field>
        <Label>API Key</Label>
        <Input name="credentials[API_KEY]" placeholder="API KEY" defaultValue={credentials["API_KEY"]} />
      </Field>
      <Field>
        <Label>Port</Label>
        <Input name="config[port]" placeholder="Port that Home Assistant LANsaver runs on" defaultValue={config.port} />
      </Field>
    </>
  );
}
