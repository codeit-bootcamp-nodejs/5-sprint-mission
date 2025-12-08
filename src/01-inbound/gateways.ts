import { NotificationGateway } from "./gateways/notification.gateway";

export class Gateways {
  constructor(public readonly notification: NotificationGateway) {}
}
