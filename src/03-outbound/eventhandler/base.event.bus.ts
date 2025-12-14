import { PersistedNotification } from "../../02-domain/entity/notification";

type Handler<T> = (event: T) => void;

export const BaseEventBus = () => {
  let notifications: Handler<any> = () => {};

  const subscribe = <T>(callback: Handler<T>) => {
    notifications = callback;
  };

  const publish = (event: any) => {
    notifications(event);
  };

  return {
    subscribe,
    publish,
  };
};
