import { services } from "../03-domain/service/services";
import { IUserController, UserController } from "./user.controller";

export interface IControllers {
  user: IUserController;
}

export const controllers: IControllers = {
  user: new UserController(services),
}