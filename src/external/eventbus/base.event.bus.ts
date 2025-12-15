export type Handler<T> = (event: T) => void;

export const BaseEventBus = <T>() => {
  let callback: Handler<T> = () => { };
  let callbackAll: Handler<T> = () => { };

  const subscribe = (_callback: Handler<T>) => {
    callback = _callback;
  };

  const subscribeAll = (_callback: Handler<T>) => {
    callbackAll = _callback;
  };

  const publish = (event: T) => {
    callback(event);
  };

  const publishAll = (event: T) => {
    callbackAll(event);
  };

  return {
    subscribe,
    subscribeAll,
    publish,
    publishAll,
  };
};
