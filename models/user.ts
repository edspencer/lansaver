"use server";
import { Prisma } from "@prisma/client";

import bcrypt from "bcryptjs";
import prisma from "../lib/prismaClient";

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
