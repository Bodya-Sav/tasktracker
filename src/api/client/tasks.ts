import { axiosInstance } from "../client";
import {
  type CreateTaskRequest,
  type ErrorResponse,
  type Task,
  TaskSchema,
  type UpdateTaskRequest,
} from "../schemas";

import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { z } from "zod";

const CreateTaskResponseSchema = z.object({
  id: z.number(),
});

const ImportTasksResponseSchema = z.object({
  message: z.string(),
  imported: z.number(),
  failed: z.number(),
  total_processed: z.number(),
  errors: z.array(z.string()).nullable(),
});

type ImportTasksResponse = z.infer<typeof ImportTasksResponseSchema>;

// --- API Functions ---
export const createTask = async (
  data: CreateTaskRequest,
): Promise<{ id: number }> => {
  const response = await axiosInstance.post(`/api/bot/planner/tasks`, data);
  return CreateTaskResponseSchema.parse(response.data);
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await axiosInstance.get(`/api/bot/planner/tasks/${id}`);
  return TaskSchema.parse(response.data);
};

export const getUnassignedTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get(`/api/bot/planner/tasks/unassigned`);
  if (response.data === null) {
    return [];
  }
  return z.array(TaskSchema).parse(response.data);
};

export const updateTask = async (
  id: number,
  data: UpdateTaskRequest,
): Promise<Task> => {
  const response = await axiosInstance.put(
    `/api/bot/planner/tasks/${id}`,
    data,
  );
  return TaskSchema.parse(response.data);
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/bot/planner/tasks/${id}`);
};

export const assignTask = async (
  taskId: number,
  userId: number,
): Promise<void> => {
  await axiosInstance.post(`/api/bot/planner/tasks/${taskId}/assign/${userId}`);
};

export const importTasks = async (file: File): Promise<ImportTasksResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    `/api/bot/planner/tasks/import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return ImportTasksResponseSchema.parse(response.data);
};

// --- TanStack Query Hooks ---
export const useCreateTask = () => {
  return useMutation<{ id: number }, ErrorResponse, CreateTaskRequest>({
    mutationFn: createTask,
  });
};

export const useImportTasks = () => {
  return useMutation<ImportTasksResponse, AxiosError<{ error: string }>, File>({
    mutationFn: importTasks,
  });
};

export const useGetTask = (
  id: number,
  options?: Omit<UseQueryOptions<Task, ErrorResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<Task, ErrorResponse>({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
    ...options,
  });
};

export const useGetUnassignedTasks = (
  options?: Omit<
    UseQueryOptions<Task[], ErrorResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<Task[], ErrorResponse>({
    queryKey: ["unassignedTasks"],
    queryFn: getUnassignedTasks,
    ...options,
  });
};

export const useUpdateTask = () => {
  return useMutation<
    Task,
    ErrorResponse,
    { id: number; data: UpdateTaskRequest }
  >({
    mutationFn: ({ id, data }) => updateTask(id, data),
  });
};

export const useDeleteTask = () => {
  return useMutation<void, ErrorResponse, number>({
    mutationFn: deleteTask,
  });
};

export const useAssignTask = () => {
  return useMutation<void, ErrorResponse, { taskId: number; userId: number }>({
    mutationFn: ({ taskId, userId }) => assignTask(taskId, userId),
  });
};
