import { NotificationEventBusType } from "../../03-outbound/eventhandler/notification.event.bus";

export interface IEventBus {
  notification: NotificationEventBusType;
}
