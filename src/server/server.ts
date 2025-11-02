import AuthConroller from "../controller/auth.controller";
import express from "express";
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from "cookie-parser";

export default class Server{
  private controller;
  private server;

  constructor(controller: AuthConroller){
    this.controller = controller;
    this.server = express();
  }

  registerMiddleware(){
    this.server.use(cors());
    this.server.use(morgan('dev'));
    this.server.use(express.json());
    this.server.use(cookieParser());
  }

  registerExceptionHandler(){
    
  }

  registerRouters(){
  }

  listen(){
    this.server.listen(3000,()=>{
      console.log("Server is running at port 3000");
    })
  }

  run(){
    this.registerMiddleware();
    this.registerRouters();
    this.registerExceptionHandler();
    this.listen();
  }
}