import { PersistedNotification } from "../../02-application/command/entity/notification";

export const NotificationResDto = (entity: PersistedNotification) => {
  const { id, type, message, read, senderId, receiverId, createdAt } = entity;

  return {
    id,
    type,
    message,
    read,
    senderId,
    receiverId,
    createdAt,
  };
};

export const NotificationResDtos = (entities: PersistedNotification[]) => {
  let unread = 0;
  let total = entities.length;

  const data = entities.map((entity: PersistedNotification) => {
    if (entity.read === false) unread += 1;
    return NotificationResDto(entity);
  });

  return {
    data,
    unread,
    total,
  };
};
