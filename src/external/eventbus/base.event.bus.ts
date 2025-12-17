
export const BaseEventBus = <T>() => {
  let callback: (event: T) => void;
  let callbackAll: (event: T) => void;

  // 특정 유저에게 메세지 전송
  const subscribe = (_callback: (event: T) => void) => {
    callback = _callback;
  };

  const publish = (event: T) => {
    callback(event);
  };


  // 다수의 유저에게 메세지 전송
  const subscribeAll = (_callback: (event: T) => void) => {
    callbackAll = _callback;
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
