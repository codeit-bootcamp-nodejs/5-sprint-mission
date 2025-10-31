import { controllers } from "../../02-controller/controllers";
import { managers } from "../../common/util/managers";
import { UserRouter } from "./user.router";

export const routers = {
  user: new UserRouter(controllers, managers),
}