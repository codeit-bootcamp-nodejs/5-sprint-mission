import { RequestHandler } from "express";
import { Validated } from "../types/http";
import { SignupDTO, LoginDTO } from "../types/dto";
import { authService } from "../services/auth.service";

export const signup: RequestHandler = async (req, res) => {
  const { validated } = req as unknown as Validated<SignupDTO>;
  const user = await authService.signup(validated);
  res.status(201).json(user);
};

export const login: RequestHandler = async (req, res) => {
  const { validated } = req as unknown as Validated<LoginDTO>;
  const tokens = await authService.login(validated);
  res.json(tokens);
};

export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken } = (req.body ?? {}) as { refreshToken?: string };
  const access = await authService.refresh(refreshToken ?? "");
  res.json({ accessToken: access });
};
