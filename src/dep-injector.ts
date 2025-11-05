import { PrismaClient } from "@prisma/client";
import AuthRepository from "./repository/auth.repository";
import AuthService from "./service/auth.service";
import AuthController from "./controller/auth.controller";
import Server from "./server/server";

export default class DependencyInjector {
  private _server;

  constructor(){
    this._server = this.inject();
  }

  inject(){
    const prisma = new PrismaClient();

    // repo
    const authRepo = new AuthRepository(prisma);

    // service
    const authService = new AuthService(authRepo);

    // controller
    const authController = new AuthController(authService);

    // server
    const server = new Server(authController);
    return server;
  }

  get server(){
    return this._server;
  }
}