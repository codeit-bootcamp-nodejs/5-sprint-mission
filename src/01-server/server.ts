import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Exception } from '../common/exception/exception'
import { Prisma } from '@prisma/client'
import cookieParser from "cookie-parser";
import { request, response } from 'express'
import { HttpError } from '../external/authenticator'


export class Server {
    #controllers
    #server

    constructor(controllers: any) {
        this.#controllers = controllers;
        this.#server = express();
    }

    registerMiddleWare() {
        this.#server.use(morgan('dev'));
        this.#server.use(cors());
        this.#server.use(express.json({ strict: false })); // must come first
        this.#server.use(cookieParser());
    }
    

    registerExceptionHandler() {
        this.#server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof Exception) {
                res.status(err.statusCode).json(err.message);
            } else if (
                err.name === "StructError" ||
                err instanceof Prisma.PrismaClientValidationError
            ) {
                res.status(400).send({ message: err.message });
            } else if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === "P2025"
            ) {
                ; res.sendStatus(404);
            } else if (err instanceof HttpError) {
                console.log(err.message);
                res.status(err.code).json({ message: err.message });
            }
            else {
                console.log(err);
                res.status(500).json({
                    message: '알 수 없는 오류가 발생했습니다.'
                })
            }
        });
    }

    registerRouters() {
        for (const controller of this.#controllers) {
            this.#server.use(controller.basePath, controller.router);
        }
    }

    listen() {
        this.#server.listen(3000, () => {
            console.log("listening at port 3000");
        })
    }


    run() {
        this.registerMiddleWare();
        this.registerRouters();
        this.registerExceptionHandler();
        this.listen();
    }
}