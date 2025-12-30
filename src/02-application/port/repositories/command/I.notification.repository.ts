import {
  NewNotification,
  PersistedNotification,
} from "../../../command/entity/notification";

export interface INotificationCommandRepository {
  create(entity: NewNotification): Promise<PersistedNotification>;

  findAll(userId: string): Promise<PersistedNotification[]>;

  findById(id: string): Promise<PersistedNotification>;

  update(id: string): Promise<PersistedNotification>;

  removeAll(userId: string): Promise<void>;

  remove(id: string): Promise<void>;
}
