import { NotificationService } from "../../domain/service/notification.service";
import { getMyNotificationsReqSchema, getUnreadCountReqSchema, markAsReadReqSchema } from "../requests/notification/notification.schemas";
import { GetNotificationsResDto } from "../responses/notification/get-notifications.res.dto";
import { GetUnreadCountResDto } from "../responses/notification/get-unread-count.res.dto";
import { BaseController, ControllerHandler } from "./base.controller";

export class NotificationController extends BaseController {
  constructor(
    private readonly _notificationService: NotificationService
  ) {
    super();
  }
  
  markAsReadController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(markAsReadReqSchema.safeParse({
      userId: req.userId,
      ...req.params
    }));

    await this._notificationService.markAsRead(reqDto);
    return res.sendStatus(200);
  };

  getMyNotificationsController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getMyNotificationsReqSchema.safeParse({
      userId: req.userId,
      ...req.query
    }));

    const notifications = await this._notificationService.getMyNotifications(reqDto);

    const resDto = new GetNotificationsResDto(notifications);
    return res.json(resDto);
  };

  getUnreadCountController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getUnreadCountReqSchema.safeParse({
      userId: req.userId,
    }));

    const unreadCount = await this._notificationService.getUnreadCount(reqDto);

    const resDto = new GetUnreadCountResDto(unreadCount);
    return res.json(resDto);
  }
}