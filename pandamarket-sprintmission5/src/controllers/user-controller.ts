import { create } from "superstruct";
import { IService } from "../domain/service";
import BadRequestError from "../lib/errors/BadRequestError";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import { UpdateMeBodyStruct, UpdatePasswordBodyStruct } from "../structs/users-structs";

export interface IUserController {
  handleGetMyInfo: (req: Request, res: Response) => Promise<void>;
  handleUpdateMyInfo: (req: Request, res: Response) => Promise<void>;
  handleChangeMyPassword: (req: Request, res: Response) => Promise<void>;
}

export class UserController extends BaseController implements IUserController {
  constructor(service: IService) {
    super(service);
  }

  public handleGetMyInfo = async (req: Request, res: Response) => {
    const user = req.user;

    res.json(user);
  };

  handleUpdateMyInfo = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const data = create(req.body, UpdateMeBodyStruct);
    const updatedUser = await this.service.user.updateMyInfo(
      userId,
      data,
    );

    res.status(200).send(updatedUser);
  }


  handleChangeMyPassword = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
    const updatedUser = await this.service.user.changeMyPassword(
      userId,
      password,
      newPassword,
    );

    res.json(updatedUser);
  };
}
