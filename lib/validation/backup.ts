import { z } from "zod";
import { Prisma } from "@prisma/client";

const BackupSchema = z.object({
  device: z.object({
    connect: z.object({
      id: z.number(),
    }),
  }),
  status: z.enum(["pending", "completed", "failed"]),
}) satisfies z.ZodType<Prisma.BackupCreateInput>;

export default BackupSchema;
