import {
  NewNotification,
  PersistedNotification,
} from "../../entity/notification";



export interface INotificationRepository {
  create(entity: NewNotification): Promise<PersistedNotification>;

  findAll(userId: string): Promise<PersistedNotification[]>;

  findById(id: string): Promise<PersistedNotification>;

  update(id: string): Promise<PersistedNotification>;

  removeAll(userId: string): Promise<void>;

  remove(id: string): Promise<void>;
}
