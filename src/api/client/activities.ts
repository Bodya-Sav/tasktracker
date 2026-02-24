import { axiosInstance } from "@/api/client";

import {
  type Activity,
  ActivitySchema,
  type AddEventRequest,
  type AssignActivityRequest,
  type ErrorResponse,
  type UpdateEventRequest,
} from "../schemas";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { z } from "zod";

// --- API Functions ---
export const createEventActivity = async (
  data: AddEventRequest,
): Promise<Activity> => {
  const response = await axiosInstance.post(
    `/api/bot/planner/activities`,
    data,
  );
  return ActivitySchema.parse(response.data);
};

export const assignTaskActivity = async (
  data: AssignActivityRequest,
): Promise<void> => {
  await axiosInstance.post(`/api/bot/planner/activities`, data);
};

export const getActivity = async (id: number): Promise<Activity> => {
  const response = await axiosInstance.get(`/api/bot/planner/activities/${id}`);
  return ActivitySchema.parse(response.data);
};

export const getUserActivities = async (
  userId: number,
): Promise<Activity[]> => {
  const response = await axiosInstance.get(
    `/api/bot/planner/activities/user/${userId}`,
  );
  if (response.data === null) {
    return [];
  }
  // If the API returns an object with numeric keys instead of an array, convert it to an array
  const data = Array.isArray(response.data)
    ? response.data
    : Object.values(response.data);
  return z.array(ActivitySchema).parse(data);
};

export const updateActivity = async (
  id: number,
  data: UpdateEventRequest,
): Promise<Activity> => {
  const response = await axiosInstance.put(
    `/api/bot/planner/activities/${id}`,
    data,
  );
  return ActivitySchema.parse(response.data);
};

export const deleteActivity = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/bot/planner/activities/${id}`);
};

// --- TanStack Query Hooks ---
export const useCreateEventActivity = () => {
  return useMutation<Activity, ErrorResponse, AddEventRequest>({
    mutationFn: createEventActivity,
  });
};

export const useAssignTaskActivity = () => {
  return useMutation<void, ErrorResponse, AssignActivityRequest>({
    mutationFn: assignTaskActivity,
  });
};

export const useGetActivity = (
  id: number,
  options?: Omit<
    UseQueryOptions<Activity, ErrorResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<Activity, ErrorResponse>({
    queryKey: ["activity", id],
    queryFn: () => getActivity(id),
    ...options,
  });
};

export const useGetUserActivities = (
  userId: number,
  options?: Omit<
    UseQueryOptions<Activity[], ErrorResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<Activity[], ErrorResponse>({
    queryKey: ["userActivities", userId],
    queryFn: () => getUserActivities(userId),
    ...options,
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Activity,
    ErrorResponse,
    { id: number; data: UpdateEventRequest }
  >({
    mutationFn: ({ id, data }) => updateActivity(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userActivities", data.assign_id],
      });
    },
  });
};

export const useDeleteActivity = () => {
  return useMutation<void, ErrorResponse, number>({
    mutationFn: deleteActivity,
  });
};
