import { PersistedNotification } from "../../02-application/command/entity/notification";
import { INotificationEventBus } from "../../shared/eventbus/ports/I.notification.eventbus";



export const NotificationHandler = (
    notifcationEventBus: INotificationEventBus,
) => {
    let _clients: Map<string, WebSocket> = new Map()

    const registerClients = (clients: Map<string, WebSocket>) => {
        _clients = clients
    }

    const registerRoutes = () => {
        notifcationEventBus.subscribe(notifyUser)
        notifcationEventBus.subscribeAll(notifyAllUsers);
    }

    const notifyUser = (notification: PersistedNotification) => {
        const userId = notification.receiverId;
        const msg = notification.message;

        if (!userId) throw new Error("존재하지 않는 유저에게 알림을 보낼 수 없습니다");
        const ws = _clients.get(userId);
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(msg);
    };



    const notifyAllUsers = (notification: PersistedNotification) => {
        const senderId = notification.senderId;
        const msg = notification.message;

        for (const [userId, ws] of _clients.entries()) {
            if (userId === senderId) continue;
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(msg);
            }
        }
    }


    registerRoutes();

    return {
        registerClients
    }
}

export type NotificationHandlerType = ReturnType<typeof NotificationHandler>