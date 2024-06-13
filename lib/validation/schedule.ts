import { z } from "zod";
import { Prisma } from "@prisma/client";
import { isValidCron } from "cron-validator";

const ScheduleSchema = z.object({
  name: z.string(),
  cron: z.string().refine((v) => isValidCron(v)),
}) satisfies z.ZodType<Prisma.ScheduleCreateInput>;

export default ScheduleSchema;
