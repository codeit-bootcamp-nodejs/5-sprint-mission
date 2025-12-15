import { Request, Response } from "express";
import { IService } from "../../domain/service";
import { IConfigUtil } from "../../shared/config";
import BadRequestError from "../../shared/errors/BadRequestError";
import { Middlewares } from "../middlewares";
import { INotificationController } from "../controller";
import { NotificationListQueryStruct } from "../structs/notifications-struct";
import { BaseController } from "./base-controller";

export class NoticationController
  extends BaseController
  implements INotificationController {
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/notifications", middlewares, service, configUtils);
    this.register();
  }
  register() {
    this.router.get(
      "/",
      this.middlewares.auth({ optional: false }),
      this.catch(this.list),
    );
    this.router.get(
      "/unread-count",
      this.middlewares.auth({ optional: false }),
      this.catch(this.unreadCount),
    );

    this.router.patch(
      "/:id/read",
      this.middlewares.auth({ optional: false }),
      this.catch(this.markRead),
    );

    this.router.patch(
      "/read-all",
      this.middlewares.auth({ optional: false }),
      this.catch(this.markAllRead),
    );
  }

  list = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { take, cursor, unreadOnly } = this.validate(
      NotificationListQueryStruct,
      req.query,
    );
    const limitedTake = Math.min(take, 50);

    const result = await this.service.notification.list({
      userId,
      take: limitedTake,
      cursor,
      unreadOnly,
    });

    res.status(200).json({ data: result });
  };

  unreadCount = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const count = await this.service.notification.unreadCount(userId);
    res.status(200).json({ count });
  };

  markRead = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new BadRequestError("유효하지 않은 알림 ID입니다.");
    }

    const updated = await this.service.notification.markRead(userId, id);
    res.status(200).json({ updated });
  };

  markAllRead = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const updated = await this.service.notification.markAllRead(userId);
    res.status(200).json({ updated });
  };

}
