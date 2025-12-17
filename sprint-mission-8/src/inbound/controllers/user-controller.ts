import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
} from "../structs/users-structs";
import { IService } from "../../domain/service";
import { IUserController } from "../controller";
import { Middlewares } from "../middlewares";
import { IConfigUtil } from "../../shared/config";
import { mapUser } from "../mappers/user-mapper";

export class UserController extends BaseController implements IUserController {
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/me", middlewares, service, configUtils);
    this.register();
  }
  register() {
    this.router.get(
      "/",
      this.middlewares.auth({ optional: false }),
      this.catch(this.getMyInfo),
    );
    this.router.patch(
      "/",
      this.middlewares.auth({ optional: false }),
      this.catch(this.updateMyInfo),
    );
    this.router.patch(
      "/password",
      this.middlewares.auth({ optional: false }),
      this.catch(this.changeMyPassword),
    );
  }

  getMyInfo = async (req: Request, res: Response) => {
    const id = req.user!.id;
    const user = await this.service.user.getMyInfo(id);

    res.json(user ? mapUser(user) : null);
  };

  updateMyInfo = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = this.validate(UpdateMeBodyStruct, req.body);
    const updatedUser = await this.service.user.updateMyInfo(userId, data);

    res.status(200).send(mapUser(updatedUser));
  };

  changeMyPassword = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { password, newPassword } = this.validate(
      UpdatePasswordBodyStruct,
      req.body,
    );
    const updatedUser = await this.service.user.changeMyPassword(
      userId,
      password,
      newPassword,
    );

    res.json(mapUser(updatedUser));
  };
}
