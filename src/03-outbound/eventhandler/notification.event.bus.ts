import { PersistedNotification } from "../../02-domain/entity/notification";
import { BaseEventBus } from "./base.event.bus";

export const NotificationEventBus = () => {
  const { subscribe, publish, subscribeAll, publishAll } = BaseEventBus();

  return {
    subscribe,
    subscribeAll,
    publish,
    publishAll
  };
};

export type NotificationEventBusType = ReturnType<typeof NotificationEventBus>;
