import { NotificationGateway } from "./gataways/notification.gateway";

export class Gateways {
  constructor(
    public readonly notification: NotificationGateway,
  ){}
}