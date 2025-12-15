import express, {
  NextFunction,
  Request,
  Response,
  RequestHandler,
  Router,
} from "express";
import { IService } from "../../domain/service";
import BadRequestError from "../../shared/errors/BadRequestError";
import { z } from "zod";
import { IConfigUtil } from "../../shared/config";
import { Middlewares } from "../middlewares";
import { assert, Struct } from "superstruct";

export abstract class BaseController {
  public readonly router: Router;

  constructor(
    public readonly path: string,
    public readonly middlewares: Middlewares,
    public readonly service: IService,
    public readonly configUtil: IConfigUtil,
  ) {
    this.router = express.Router();
  }

  abstract register(): void;

  public validate<T, S>(schema: Struct<T, S>, value: unknown): T {
    assert(value, schema);
    return value as T;
  }

  public catch(handler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}
