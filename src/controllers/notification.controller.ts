import { RequestHandler } from "express";
import { AuthedRequest } from "../types/http";
import { notificationRepository } from "../repositories/notification.repository";

export const list: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req as AuthedRequest;

    const [items, unreadCount] = await Promise.all([
      notificationRepository.findByUser(user.id),
      notificationRepository.countUnread(user.id),
    ]);

    res.json({
      unreadCount,
      items,
    });
  } catch (err) {
    next(err);
  }
};

export const read: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await notificationRepository.read(Number(req.params.id), user.id);
  res.status(204).end();
};
