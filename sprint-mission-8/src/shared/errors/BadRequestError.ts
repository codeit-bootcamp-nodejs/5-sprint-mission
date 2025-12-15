import AppError from "./AppError";

class BadRequestError extends AppError {
  constructor(message = "잘못된 요청", details?: unknown) {
    super({
      message,
      status: 400,
      code: "BAD_REQUEST",
    });
    this.name = "BadRequestError";
  }
}

export default BadRequestError;
