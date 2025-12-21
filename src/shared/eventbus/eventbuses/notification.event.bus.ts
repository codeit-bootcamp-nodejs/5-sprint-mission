import { PersistedNotification } from "../../../02-domain/entity/notification";
import { INotificationEventBus } from "../ports/I.notification.eventbus";
import { BaseEventBus } from "./base.event.bus";


export const NotificationEventBus = (): INotificationEventBus => {
  return BaseEventBus<PersistedNotification>()
};

