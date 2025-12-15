import { INotificationEventBus } from "../../01-inbound/port/eventbuses/notification.eventbus";
import { PersistedNotification } from "../../02-domain/entity/notification";
import { BaseEventBus } from "./base.event.bus";

export const NotificationEventBus = ():INotificationEventBus => {
  return BaseEventBus<PersistedNotification>()
};

