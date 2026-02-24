import { axiosInstance } from "../client";
import {
  type ErrorResponse,
  type User,
  type UserRequest,
  UserSchema,
} from "../schemas";

import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { z } from "zod";

// --- API Functions ---
export const createUser = async (data: UserRequest): Promise<User> => {
  const response = await axiosInstance.post(`/api/bot/planner/users`, data);
  return UserSchema.parse(response.data);
};

export const getUser = async (id: number): Promise<User> => {
  const response = await axiosInstance.get(`/api/bot/planner/users/${id}`);
  return UserSchema.parse(response.data);
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(`/api/bot/planner/users`);
  return z.array(UserSchema).parse(response.data);
};

export const updateUser = async (
  id: number,
  data: Partial<UserRequest>,
): Promise<User> => {
  const response = await axiosInstance.put(
    `/api/bot/planner/users/${id}`,
    data,
  );
  return UserSchema.parse(response.data);
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/bot/planner/users/${id}`);
};

// --- TanStack Query Hooks ---
export const useCreateUser = () => {
  return useMutation<User, ErrorResponse, UserRequest>({
    mutationFn: createUser,
  });
};

export const useGetUser = (
  id: number,
  options?: Omit<UseQueryOptions<User, ErrorResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<User, ErrorResponse>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    ...options,
  });
};

export const useGetAllUsers = (
  options?: Omit<
    UseQueryOptions<User[], ErrorResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<User[], ErrorResponse>({
    queryKey: ["users"],
    queryFn: getAllUsers,
    ...options,
  });
};

export const useUpdateUser = () => {
  return useMutation<
    User,
    ErrorResponse,
    { id: number; data: Partial<UserRequest> }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
  });
};

export const useDeleteUser = () => {
  return useMutation<void, ErrorResponse, number>({
    mutationFn: deleteUser,
  });
};
