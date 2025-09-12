import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Exception } from "../common/exception.js";

export class Server {
  #_server;

  constructor() {
    this.#_server = express();
  }

  listen = () => {
    this.#_server.listen(3000, () => {
      console.log("app server listening on port 3000");
    })
  }

  registerBaseMiddlewares = () =>{
    this.#_server.use(cors());
    this.#_server.use(morgan("dev"));
    this.#_server.use(express.json());
  }

  registerExceptionMiddleware = () => {
    this.#_server.use((err, req, res, next) => {
      if(err instanceof Exception){
        res.status(err.statusCode).json({message: err.message});
      }else{
        res.status(500).json({message: "알 수 없는 에러 발생!!!"});
      }
    });
  };

  start = () => {
    this.registerBaseMiddlewares();
    this.registerExceptionMiddleware();
    this.listen();
  }
}