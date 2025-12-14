import { PersistedNotification } from "../../02-domain/entity/notification";

export const NotificationResDto = (entity: PersistedNotification) => {
  const { id, type, message, read, senderId, receiverId, createdAt } = entity;

  return {
    id,
    type,
    message,
    read,
    senderId,
    receiverId,
    createdAt
  };
};

export const NotificationResDtos = (entities: PersistedNotification[]) => {
  const data = entities.map((entity) => {
    return NotificationResDto(entity);
  });

  const total = data.length;

  return {
    data,
    total,
  };
};
