export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL";

export interface AppErrorOptions {
  message: string;
  status?: number;
  code?: ErrorCode;
}

class AppError extends Error {
  status: number;
  code: ErrorCode;

  constructor({ message, status = 500, code = "INTERNAL" }: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export default AppError;
