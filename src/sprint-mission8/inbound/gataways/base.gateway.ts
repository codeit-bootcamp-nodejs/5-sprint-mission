import { Server as DefaultWsServer, Socket } from "socket.io";
import z from "zod";
import { IServices } from "../port/services.interface";
import { IUtils } from "../../shared/util";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Middlewares } from "../middlewares";

export abstract class BaseGateway {
  constructor(
    public readonly services: IServices,
    public readonly utils: IUtils,
    public readonly middlewares: Middlewares
  ) { }

  abstract register(io: DefaultWsServer): void;

  validate<T extends z.ZodType>(schema: T, data: unknown) {
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      throw new Exception({
        info: EXCEPTIONS.ZOD_FORM,
        message: parsedData.error.issues[0].message,
      });
    }

    return parsedData.data;
  }

  catch(socket: Socket, handler: (data: unknown) => Promise<void>) {
    return async (data: unknown) => {
      try {
        await handler(data);
      } catch (err) {
        if (err instanceof Exception) {
          const { statusCode, message } = err;

          socket.emit("err", { statusCode, message });

          if (this.utils.config.getParsed().NODE_ENV === "development") {
            console.error(err);
          } else {
            // TODO: Sentry 도입 후 로그(분석) 전송
          }
          return;
        }

        socket.emit("err", {
          statusCode: 500,
          message: "알 수 없는 서버 에러입니다.",
        });

        if (this.utils.config.getParsed().NODE_ENV === "development") {
          console.error(err);
        } else {
          // TODO: Sentry 도입 후 에러(긴급) 전송
        }
      }
    };
  }
}
