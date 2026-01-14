import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http, { Server as DefaultHttpServer } from "http";
import { Prisma } from "@prisma/client";
import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { isBusinessException } from "../../shared/exception/exception";
import { HttpError } from "../../shared/authenticator/authenticator";

export const createHttpServer = (controllers: any) => {
  const server = express();
  const defaultHttpServer = http.createServer(server);

  const registerMiddleWare = () => {
    server.use(morgan("dev"));
    server.use(cors());
    server.use(express.json({ strict: false }));
    server.use(cookieParser());
  };

  const registerExceptionHandler = () => {
    server.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (isBusinessException(err)) {
          const { statusCode = 400, message } = err;
          return res.status(statusCode).json({ message });
        } else if (
          err.name === "StructError" ||
          err instanceof PrismaClientValidationError
        ) {
          res.status(400).send({ message: err.message });
        } else if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          res.sendStatus(404);
        } else if (err instanceof HttpError) {
          res.status(400).json({ message: err.message });
        } else {
          console.log(err);
          res.status(500).json({
            message: "알 수 없는 오류가 발생했습니다.",
          });
        }
      },
    );
  };

  const registerRouters = () => {
    for (const controller of controllers) {
      server.use(controller.basePath, controller.router);
    }
  };

  const listen = () => {
    const isTestEnv =
      process.env.NODE_ENV === "test" ||
      typeof process.env.JEST_WORKER_ID !== "undefined";

    if (isTestEnv) {
      return; // Skip listening in tests
    }

    if (defaultHttpServer.listening) {
      return; // Already listening
    }

    defaultHttpServer.listen(process.env.PORT, () => {
      console.log(`listening at port ${process.env.PORT}`);
    });
  };

  const run = () => {
    registerMiddleWare();
    registerRouters();
    registerExceptionHandler();
    listen();
  };

  return {
    run,
    defaultHttpServer,
    server,
  };
};

export type HttpServerType = ReturnType<typeof createHttpServer>;
