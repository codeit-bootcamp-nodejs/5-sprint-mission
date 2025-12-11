import { NewNotificationEntity, PersistNotificationEntity } from "../../entity/notification";

export interface INotificationRepository {
    create(entity: NewNotificationEntity) : Promise<PersistNotificationEntity>
}