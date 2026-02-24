import { z } from "zod";

export const TaskPullSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  created_at: z.string(),
});

export const TimeValidSchema = z.object({
  Time: z.string(),
  Valid: z.boolean(),
});

export const ActivitySchema = z.object({
  id: z.number(),
  assign_id: z.number(),
  task_id: z.number(),
  task_pull: TaskPullSchema,
  status: z.enum(["todo", "in_progress", "done"]),
  start_time: TimeValidSchema,
  deadline: TimeValidSchema,
  created_at: z.string(),
});

export const AssignActivityRequestSchema = z.object({
  assign_id: z.number(),
  task_id: z.number(),
  status: z.enum(["todo", "in_progress", "done"]),
  start_time: z.string(),
  deadline: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;
export type AssignActivityRequest = z.infer<typeof AssignActivityRequestSchema>;
export type TaskPull = z.infer<typeof TaskPullSchema>;
export type TimeValid = z.infer<typeof TimeValidSchema>;

export const AddEventRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  assign_id: z.number(),
  start_time: z.string(),
  deadline: z.string(),
  status: z.enum(["todo", "in_progress", "done"]),
});
export type AddEventRequest = z.infer<typeof AddEventRequestSchema>;

export const UpdateEventRequestSchema = z.object({
  task_id: z.number(),
  title: z.string().optional(),
  assign_id: z.number(),
  start_time: TimeValidSchema,
  deadline: TimeValidSchema,
  description: z.string(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
});
export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
