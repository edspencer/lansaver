import { z } from "zod";
import { Prisma } from "@prisma/client";

const DeviceSchema = z.object({
  type: z.string(),
  hostname: z.string().min(2),
  config: z.string(),
}) satisfies z.ZodType<Prisma.DeviceCreateInput>;

export default DeviceSchema;
