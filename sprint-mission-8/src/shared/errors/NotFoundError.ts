import AppError from "./AppError";

class NotFoundError extends AppError {
  constructor(modelName: string, id: number | string) {
    super({
      message: `${modelName} with id ${id} not found`,
      status: 404,
      code: "NOT_FOUND",
    });
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
