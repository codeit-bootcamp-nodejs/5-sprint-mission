import { PersistedNotification } from "../../02-domain/entity/notification";

type Handler<T> = (event: T) => void;

export const BaseEventBus = () => {
  let notify: Handler<any> = () => { };
  let notifyAll: Handler<any> = () => { };

  const subscribe = <T>(callback: Handler<T>) => {
    notify = callback;
  };


  const subscribeAll = <T>(callback: Handler<T>) => {
    notifyAll = callback
  }


  const publish = (event: any) => {
    notify(event);
  };

  const publishAll = (event: any) => {
    notifyAll(event);
  }

  return {
    subscribe,
    subscribeAll,
    publish,
    publishAll
  };
};
