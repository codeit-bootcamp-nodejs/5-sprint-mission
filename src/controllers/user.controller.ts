import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { UpdateMeDTO, ChangePasswordDTO } from "../types/dto";
import { userService } from "../services/user.service";

export const me: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  res.json(await userService.me(user.id));
};

export const updateMe: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest & Validated<UpdateMeDTO>;
  res.json(await userService.updateMe(user.id, validated));
};

export const changePassword: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<ChangePasswordDTO>;
  await userService.changePassword(user.id, validated);
  res.json({ ok: true });
};

export const myLikedProducts: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  res.json(await userService.myLikedProducts(user.id));
};
