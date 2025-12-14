import { PersistedNotification } from "../../02-domain/entity/notification";
import { BaseEventBus } from "./base.event.bus";

export const NotificationEventBus = () => {
  const { subscribe, publish } = BaseEventBus();

  return {
    subscribe,
    publish,
  };
};

export type NotificationEventBusType = ReturnType<typeof NotificationEventBus>;
