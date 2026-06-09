export interface ApiResponse<T> {
  data: T;
  status: "ok" | "error";
  message?: string;
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
  code?: string;
}
