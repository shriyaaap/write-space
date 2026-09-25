"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { z } from "zod";

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or less."),

  username: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_]{3,30}$/,
      "Username must be 3 to 30 characters and contain only letters, numbers, and underscores."
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email is too long."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or less."),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email is too long."),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(72, "Password is too long."),
});

export async function signup(
  prevState: { error: string },
  formData: FormData
) {
  const name = formData.get("name")?.toString() ?? "";
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const result = signupSchema.safeParse({
    name,
    username,
    email,
    password,
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const {
    name: validName,
    username: validUsername,
    email: validEmail,
    password: validPassword,
  } = result.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: validEmail.toLowerCase() },
        { username: validUsername },
      ],
    },
  });

  if (existingUser) {
    return {
      error: "Username or email is already in use.",
    };
  }

  const hashedPassword = await hashPassword(validPassword);

  const user = await prisma.user.create({
    data: {
      name: validName,
      username: validUsername,
      email: validEmail.toLowerCase(),
      password: hashedPassword,
    },
  });

  await createSession(user.id);

  redirect("/");
}

export async function login(
  prevState: { error: string },
  formData: FormData
) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const result = loginSchema.safeParse({
    email,
    password,
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const { email: validEmail, password: validPassword } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email: validEmail.toLowerCase(),
    },
  });

  if (!user) {
    return {
      error: "Invalid email or password.",
    };
  }

  const passwordValid = await verifyPassword(
    validPassword,
    user.password
  );

  if (!passwordValid) {
    return {
      error: "Invalid email or password.",
    };
  }

  await createSession(user.id);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}