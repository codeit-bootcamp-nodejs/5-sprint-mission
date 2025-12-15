import { notificationRepository } from "../repositories/notification.repository";
import { Request, Response } from "express";

export const notificationController = {
  async list(req: Request, res: Response) {
    const userId = req.user.id;
    const notifications = await notificationRepository.findByUser(userId);
    res.json(notifications);
  },

  async unreadCount(req: Request, res: Response) {
    const userId = req.user.id;
    const count = await notificationRepository.countUnread(userId);
    res.json({ count });
  },

  async read(req: Request, res: Response) {
    const userId = req.user.id;
    const id = Number(req.params.id);
    await notificationRepository.read(id, userId);
    res.status(204).end();
  },
};
