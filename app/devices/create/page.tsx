"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Heading } from "@/components/common/heading";
import { Button } from "@/components/common/button";
import { Field, Label, Description } from "@/components/common/fieldset";
import { Input } from "@/components/common/input";
import { Select } from "@/components/common/select";
import error from "next/error";
import { SubmitButton } from "@/components/device/buttons";

import { createDeviceAction } from "@/app/actions/devices";
import { FormEvent } from "react";

import type { CreateDeviceAction } from "@/app/actions/devices";
import DeviceForm from "@/components/device/form";

const initialState = {
  message: "Cool",
  error: null,
} as CreateDeviceAction;

export default function CreateDevice() {
  return (
    <>
      <CreateDeviceUsingAction />
      <CreateDeviceAPI />
    </>
  );
}

function CreateDeviceUsingAction() {
  const [state, formAction] = useFormState(createDeviceAction, initialState);

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>New Device</Heading>
        <div className="flex gap-4">
          <Button href="/devices" outline>
            Cancel
          </Button>
        </div>
      </div>
      <DeviceForm formAction={formAction} />
      <p>{state.message}</p>
      <pre>{JSON.stringify(state.error, null, 4)}</pre>
    </div>
  );
}

function CreateDeviceAPI() {
  //clone the initialState object into a new object
  // const state = { ...initialState } as CreateDeviceAction;
  const [state, setState] = useState({ ...initialState });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    //get the form data
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    console.log(formData);
    const response = await fetch("/api/devices", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    try {
      const resData = await response.json();

      setState({
        ...state,
        ...resData,
      });
    } catch (e) {
      // we could not even parse the response JSON
      state.message = "Failed to create device";
      state.error = null;
      state.success = false;
    }
  }

  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
        <Heading>New Device</Heading>
        <div className="flex gap-4">
          <Button href="/devices" outline>
            Cancel
          </Button>
        </div>
      </div>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
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
          <Input name="hostname" placeholder="http://192.168.1.1" />
        </Field>
        <Field>
          <Label>Credentials</Label>
          <Description>This makes no sense</Description>
          <Input name="credentials" placeholder="okcool" />
        </Field>
        <div className="flex justify-end">
          <SubmitButton />
        </div>
        <p>{state.message}</p>
        <pre>{JSON.stringify(state.error, null, 4)}</pre>
      </form>
    </div>
  );
}
