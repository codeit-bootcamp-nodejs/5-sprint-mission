import { Prisma } from "@prisma/client";

export function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (err) {
      if (
        err.name === "StructError" ||
        err instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: err.message });
      } else if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: err.message });
      }
    }
  };
}
