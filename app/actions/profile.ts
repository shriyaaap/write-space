"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionUserId } from "@/lib/auth/session";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),

  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ActionState = {
  error?: string;
  success?: string;
} | null;

export async function updateProfile(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const result = profileSchema.safeParse({
    username:
      formData.get("username")?.toString() ?? "",

    name:
      formData.get("name")?.toString() ?? "",

    email:
      formData.get("email")?.toString() ?? "",
  });

  if (!result.success) {
    return {
      error:
        result.error.issues[0]?.message ??
        "Invalid profile details",
    };
  }

  const { username, name, email } = result.data;

  // Check if another user already has this username
  const existingUsername = await prisma.user.findFirst({
    where: {
      username,
      NOT: {
        id: userId,
      },
    },
  });

  if (existingUsername) {
    return {
      error: "That username is already taken.",
    };
  }

  // Check if another user already has this email
  const existingEmail = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: userId,
      },
    },
  });

  if (existingEmail) {
    return {
      error: "That email is already in use.",
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
      name,
      email,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return {
    success: "Profile updated successfully.",
  };
}

export async function changePassword(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const result = passwordSchema.safeParse({
    currentPassword:
      formData.get("currentPassword")?.toString() ?? "",

    newPassword:
      formData.get("newPassword")?.toString() ?? "",

    confirmPassword:
      formData.get("confirmPassword")?.toString() ?? "",
  });

  if (!result.success) {
    return {
      error:
        result.error.issues[0]?.message ??
        "Invalid password",
    };
  }

  const { currentPassword, newPassword } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      error: "User not found.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatches) {
    return {
      error: "Current password is incorrect.",
    };
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: "Password changed successfully.",
  };
}