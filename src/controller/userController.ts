import type { Request, Response, NextFunction } from "express";
import type { UserService } from "../service/userService";
import {
  SignupDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from "../common/dto";

export class UserController {
  #userService: UserService;
  constructor(userService: UserService) {
    this.#userService = userService;
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as SignupDto;
      const user = await this.#userService.signup(payload);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as LoginDto;
      const tokens = await this.#userService.login(payload);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      const tokens = await this.#userService.refreshToken(refreshToken);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const user = await this.#userService.getProfile(userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const updateData = req.body as UpdateProfileDto;
      const updated = await this.#userService.updateProfile(userId, updateData);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body as ChangePasswordDto;
      await this.#userService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  };

  getUserProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const products = await this.#userService.getUserProducts(userId);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };
}