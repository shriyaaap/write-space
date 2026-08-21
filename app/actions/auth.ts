"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";

export async function signup(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!name || !username || !email || !password) {
    return {
      error: "All fields are required.",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    return {
      error: "Username or email is already in use.",
    };
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
    },
  });

  await createSession(user.id);

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      error: "Invalid email or password.",
    };
  }

  const passwordValid = await verifyPassword(
    password,
    user.password
  );

  if (!passwordValid) {
    return {
      error: "Invalid email or password.",
    };
  }

  await createSession(user.id);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}