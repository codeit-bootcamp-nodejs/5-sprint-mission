import { NewNotificationEntity, PersistedNotificationEntity } from "../../entity/notification";

export interface INotificationRepository {
    create(entity: NewNotificationEntity): Promise<PersistedNotificationEntity>
    findAll(userId: string): Promise<PersistedNotificationEntity[]>
    findById(id: string): Promise<PersistedNotificationEntity>
    remove(id: string): Promise<void>
    removeAll(userId: string): Promise<void>
}