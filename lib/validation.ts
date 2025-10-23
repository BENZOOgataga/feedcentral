import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
});

export const articlesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const addSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  url: z.string().url("Invalid URL"),
  category: z.enum([
    "Technology",
    "Cybersecurity",
    "World News",
    "Business and Finance",
    "Science",
    "Programming",
    "Infrastructure and DevOps",
    "AI and Machine Learning",
  ]),
});

export const deleteSourceSchema = z.object({
  id: z.string().uuid("Invalid source ID"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ArticlesQueryInput = z.infer<typeof articlesQuerySchema>;
export type AddSourceInput = z.infer<typeof addSourceSchema>;
export type DeleteSourceInput = z.infer<typeof deleteSourceSchema>;
