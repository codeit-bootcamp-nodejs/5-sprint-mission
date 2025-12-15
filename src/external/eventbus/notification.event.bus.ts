import { PersistedNotification } from "../../02-domain/entity/notification";
import { BaseEventBus } from "./base.event.bus";

export const NotificationEventBus = () => {
  return BaseEventBus<PersistedNotification>()
};

export type NotificationEventBusType = ReturnType<typeof NotificationEventBus>;
