import { Server as DefaultWsServer, Socket } from "socket.io";
import { z } from "zod";
import { IServices } from "../port/i.service";

export abstract class BaseGateway {
    constructor(
        public readonly services: IServices,
    ) { }

    abstract register(io: DefaultWsServer): void;

    validate<T extends z.ZodType>(schema: T, data: unknown) {
        const parsedData = schema.safeParse(data);
        if (!parsedData.success) {
            throw new Error("Invalid data format");
        }

        return parsedData.data;
    }

    catch(socket: Socket, handler: (data: unknown) => Promise<void>) {
        return async (data: unknown) => {
            try {
                await handler(data);
            } catch (err) {
                socket.emit("err", {
                    statusCode: 500,
                    message: "알 수 없는 서버 에러입니다.",
                });
            }
        };
    }
}
