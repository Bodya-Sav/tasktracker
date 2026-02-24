import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int(),
  tg_id: z.number().int(),
  tg_tag: z.string(),
  username: z.string(),
  role: z.string(),
  created_at: z.coerce.date(),
});

export const UserRequestSchema = UserSchema.omit({
  id: true,
  created_at: true,
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type UserRequest = z.infer<typeof UserRequestSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
