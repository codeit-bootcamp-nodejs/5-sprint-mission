import { PersistedNotification } from "../../../02-application/command/entity/notification";

export interface INotificationEventBus {
  subscribe(_callback: (event: PersistedNotification) => void): void;
  publish(event: PersistedNotification): void;
  subscribeAll(_callback: (event: PersistedNotification) => void): void;
  publishAll(event: PersistedNotification): void;
}
