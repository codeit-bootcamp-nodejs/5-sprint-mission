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
import { HttpError } from "../../external/authenticator";
import { BusinessException } from "../../common/exception/exception";

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
        if (err instanceof BusinessException) {
          res.json(err.message);
        } else if (
          err.name === "StructError" ||
          err instanceof Prisma.PrismaClientValidationError
        ) {
          res.status(400).send({ message: err.message });
        } else if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          res.sendStatus(404);
        } else if (err instanceof HttpError) {
          console.log(err.message);
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
    defaultHttpServer.listen(3000, () => {
      console.log("listening at port 3000");
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
  };
};

export type HttpServerType = ReturnType<typeof createHttpServer>;
