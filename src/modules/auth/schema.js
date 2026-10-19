import { z } from "zod";
import { UserRole } from "@prisma/client";


const baseUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.email(),
  password: z.string().min(8),
});

// Enforce departmentId ONLY when role is STUDENT or INSTRUCTOR
export const createUserSchema = z.discriminatedUnion("role", [
  baseUserSchema.extend({
    role: z.literal(UserRole.STUDENT),
    departmentId: z.uuid("Department is required for students"),
  }),
  baseUserSchema.extend({
    role: z.literal(UserRole.INSTRUCTOR),
    departmentId: z.uuid("Department is required for instructors"),
  }),
  baseUserSchema.extend({
    role: z.literal(UserRole.PARENT),
    departmentId: z.undefined().optional(),
  }),
]);

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
