import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express"
import z from 'zod';

export class BaseController {
    #basePath;
    #router;

    constructor(basePath: string) {
        this.#basePath = basePath;
        this.#router = express.Router();
    }

    validate<T extends z.ZodType>(schema: T, data: unknown) {
        const result = schema.safeParse(data);
        if (!result.success) {
            const errorMessage = result.error.issues.pop()?.message ?? "요청 데이터가 유효하지 않습니다.";
            throw new Error(errorMessage);
        }
        return result.data;
    }

    catch(handler: RequestHandler) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await handler(req, res, next);
            } catch (err) {
                next(err);
            }
        };
    }

    get basePath() {
        return this.#basePath;
    }

    get router() {
        return this.#router;
    }
}