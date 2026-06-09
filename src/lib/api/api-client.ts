import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchApi<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}
