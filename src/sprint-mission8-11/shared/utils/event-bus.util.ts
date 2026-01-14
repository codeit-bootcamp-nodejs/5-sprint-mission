export interface IEventBusUtil {
  subscribe<T>(
    event: new (...args: any[]) => T,
    handler: (event: T) => void,
  ): void;
  publish<T extends object>(event: T): void;
}

export class EventBusUtil {
  private handlers = new Map<string, Function[]>();

  subscribe<T>(
    event: new (...args: any[]) => T,
    handler: (event: T) => void,
  ): void {
    const key = event.name;
    const list = this.handlers.get(key) ?? [];
    list.push(handler);
    this.handlers.set(key, list);
  }

  publish<T extends object>(event: T): void {
    const key = event.constructor.name;
    this.handlers.get(key)?.forEach((h) => h(event));
  }
}
