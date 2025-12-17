import AppError from "./AppError";

class UnauthorizedError extends AppError {
  constructor(message = "인증이 필요합니다") {
    super({
      message,
      status: 401,
      code: "UNAUTHORIZED",
    });
    this.name = "UnauthorizedError";
  }
}

export default UnauthorizedError;
