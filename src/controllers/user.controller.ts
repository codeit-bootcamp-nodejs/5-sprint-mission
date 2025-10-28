import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await userService.me(req.user!.id));
  } catch (e) {
    next(e);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nickname, image } = req.body as {
      nickname?: string;
      image?: string | null;
    };
    res.json(
      await userService.update(req.user!.id, nickname, image ?? undefined),
    );
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    res.json(
      await userService.changePassword(
        req.user!.id,
        currentPassword,
        newPassword,
      ),
    );
  } catch (e) {
    next(e);
  }
};

export const likedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await userService.likedProducts(req.user!.id));
  } catch (e) {
    next(e);
  }
};
