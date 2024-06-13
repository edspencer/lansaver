import { z } from "zod";
import { Prisma } from "@prisma/client";

const ScheduleSchema = z.object({
  name: z.string(),
  cron: z.string().min(5),
}) satisfies z.ZodType<Prisma.ScheduleCreateInput>;

export default ScheduleSchema;
