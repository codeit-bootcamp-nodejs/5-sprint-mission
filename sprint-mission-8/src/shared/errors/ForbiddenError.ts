import AppError from "./AppError";

class ForbiddenError extends AppError {
  constructor(message = "권한이 없습니다") {
    super({
      message,
      status: 403,
      code: "FORBIDDEN",
    });
    this.name = "ForbiddenError";
  }
}

export default ForbiddenError;
