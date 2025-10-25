import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Exception } from '../common/exception/exception.js'
import { Prisma } from '@prisma/client'
import cookieParser from "cookie-parser";


export class Server {
    #controllers
    #server

    constructor(controllers) {
        this.#controllers = controllers;
        this.#server = express();
    }

    registerMiddleWare() {
        this.#server.use(cors());
        this.#server.use(morgan('dev'));
        this.#server.use(express.json());
        this.#server.use(cookieParser());
    }

    registerExceptionHandler() {
        this.#server.use((err, req, res, next) => {

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
                res.sendStatus(404);
            } else {

                console.log(err); // 개발자만 제세한 에러 내용을 확인할 수 있도록 콘솔에 출력
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