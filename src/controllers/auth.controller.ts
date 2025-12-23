import { RequestHandler } from "express";
import { authService } from "../services/auth.service";

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};
    const access = await authService.refresh(refreshToken);
    res.json({ accessToken: access });
  } catch (err) {
    next(err);
  }
};
