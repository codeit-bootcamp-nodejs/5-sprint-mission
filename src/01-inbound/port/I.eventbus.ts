import { INotificationEventBus } from "./eventbuses/notification.eventbus";

export interface IEventBus {
  notification: INotificationEventBus;
}
