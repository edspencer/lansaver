"use server";
import { Prisma, PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";

import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function createUser(data: Prisma.UserCreateInput) {
  return await prisma.user.create({
    data: {
      ...data,
      password: data.password ? await hashPassword(data.password) : null,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  return user;
}

export async function deleteAllUsers() {
  return await prisma.user.deleteMany({});
}
