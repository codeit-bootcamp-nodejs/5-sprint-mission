import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { UpdateMeDTO, ChangePasswordDTO } from "../types/dto";
import { userService } from "../services/user.service";

export const me: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const me = await userService.me(user.id);
  res.json(me);
};

export const updateMe: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest & Validated<UpdateMeDTO>;
  const updated = await userService.updateMe(user.id, validated);
  res.json(updated);
};

export const changePassword: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest & Validated<ChangePasswordDTO>;
  await userService.changePassword(user.id, validated);
  res.status(200).json({ ok: true });
};

export const myLikedProducts: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const items = await userService.myLikedProducts(user.id);
  res.json(items);
};
