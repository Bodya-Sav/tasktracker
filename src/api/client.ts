import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const API_BASE_URL = "api_to_backend";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const queryClient = new QueryClient();

export * from "./client/activities";
export * from "./client/tasks";
export * from "./client/users";
