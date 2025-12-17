import { PrismaClient } from "@prisma/client";
import { AuthenticateMiddleware, Options } from "./middlewares/authenticate";
import {
  defaultNotFoundMiddleware,
  GlobalErrorMiddleware,
} from "./middlewares/errors";

export class Middlewares {
  constructor(
    private readonly prisma: PrismaClient,
    public readonly globalError: GlobalErrorMiddleware,
    public readonly defaultError: defaultNotFoundMiddleware,
  ) {}

  auth = (options: Options = {}) => {
    return new AuthenticateMiddleware(this.prisma, options).handler();
  };
}
