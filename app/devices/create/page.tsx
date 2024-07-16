"use client";

import { Heading } from "@/components/common/heading";
import { Button } from "@/components/common/button";
import { CreateForm } from "@/components/device/form";

export default function CreateDevicePage() {
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
      <CreateForm />
    </div>
  );
}
