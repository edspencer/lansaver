import { z } from "zod";
import { Prisma } from "@prisma/client";

export const DeviceSchema = z.object({
  type: z.string(),
  hostname: z.string().min(2),
  config: z.string(),
}) satisfies z.ZodType<Prisma.DeviceCreateInput>;

export const BackupSchema = z.object({
  device: z.object({
    connect: z.object({
      id: z.number(),
    }),
  }),
  status: z.enum(["pending", "completed", "failed"]),
}) satisfies z.ZodType<Prisma.BackupCreateInput>;
