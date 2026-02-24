import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  start_time: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  created_at: z.coerce.date(),
  assigned_to: z.number().int().nullable().optional(),
});

export const CreateTaskRequestSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  priority: z.enum(["low", "medium", "high"]),
});
export const UpdateTaskRequestSchema = CreateTaskRequestSchema.extend({
  start_time: z.string().optional(),
  deadline: z.string().optional(),
}).partial();

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;
