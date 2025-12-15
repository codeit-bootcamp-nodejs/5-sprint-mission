import { RequestHandler } from "express";
import { AuthedRequest } from "../types/http";
import { notificationRepository } from "../repositories/notification.repository";

export const list: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  res.json(await notificationRepository.findByUser(user.id));
};

export const unreadCount: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  res.json({
    count: await notificationRepository.countUnread(user.id),
  });
};

export const read: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await notificationRepository.read(Number(req.params.id), user.id);
  res.status(204).end();
};
