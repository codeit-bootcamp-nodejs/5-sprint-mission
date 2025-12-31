import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import { HttpError } from "../middlewares/error.handler";
import { UpdateMeDto, ChangePasswordDto } from "../dto/user.dto";

export class UserController {
  private userService;
  
  constructor(userService: UserService) {
    this.userService = userService;
  }

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const user = await this.userService.getMe(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data: UpdateMeDto = req.body;

      const updatedUser = await this.userService.updateMe(userId, data);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data: ChangePasswordDto = req.body;

      await this.userService.changePassword(userId, data);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getUserProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const products = await this.userService.getMyProducts(userId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getLikedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;

      const products = await this.userService.getLikedProducts(userId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new HttpError(400, "이미지 파일을 찾을 수 없습니다.");
      }
      const imageUrl = `/api/uploads/${req.file.filename}`;
      res.status(201).json({ url: imageUrl });
    } catch (error) {
      next(error);
    }
  };
}
