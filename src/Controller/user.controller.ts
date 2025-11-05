import { Request, Response, NextFunction } from "express";
import { UserService } from "../Service/user.service";
import { SignupDto, SigninDto } from "../dto/user.dto";

const userService = new UserService();

export class UserController {
  signup = async (req: Request<{}, {}, SignupDto>, res: Response, next: NextFunction) => {
    try {
      const user = await userService.signup(req.body);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  };

  signin = async (req: Request<{}, {}, SigninDto>, res: Response, next: NextFunction) => {
    try {
      const tokens = await userService.signin(req.body);
      res.status(200).json(tokens);
    } catch (e) {
      next(e);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const token = await userService.refresh(refreshToken);
      res.status(200).json(token);
    } catch (e) {
      next(e);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getMe(req.user!.id);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.updateProfile(req.user!.id, req.body);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(req.user!.id, oldPassword, newPassword);
      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  };
}
