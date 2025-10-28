import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, nickname, password } = req.validated;
    const user = await authService.signup(email, nickname, password);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.validated;
    const tokens = await authService.login(email, password);
    res.json(tokens);
  } catch (e) {
    next(e);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  } catch (e) {
    next(e);
  }
};
