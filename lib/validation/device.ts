import { z } from "zod";
import { Prisma } from "@prisma/client";
import { DeviceTypes } from "../enums";

const DeviceSchema = z
  .object({
    type: z.enum([Object.keys(DeviceTypes)[0], ...Object.keys(DeviceTypes)]),
    hostname: z.string().min(2).optional().nullable(),
    config: z.string(),
  })
  .refine(
    (data) => {
      if (data.type !== "lansaver" && !data.hostname) {
        return false;
      }
      return true;
    },
    {
      message: "hostname is required unless type is 'lansaver'",
      path: ["hostname"],
    }
  ) satisfies z.ZodType<Prisma.DeviceCreateInput>;

export default DeviceSchema;
