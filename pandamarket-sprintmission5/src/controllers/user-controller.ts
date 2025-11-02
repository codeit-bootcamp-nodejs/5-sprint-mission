import { IService } from "../domain/service";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

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
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }
    const updateData = req.body;
    const updatedUser = await this.service.user.updateMyInfo(
      userId,
      updateData,
    );

    res.json(updatedUser);
  };

  handleChangeMyPassword = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      throw new Error("현재 비밀번호와 새 비밀번호를 입력해주세요");
    if (newPassword.length < 6)
      throw new Error("새 비밀번호는 최소 6자 이상이어야 합니다");
    const updatedUser = await this.service.user.changeMyPassword(
      userId,
      currentPassword,
      newPassword,
    );

    res.json(updatedUser);
  };
}
