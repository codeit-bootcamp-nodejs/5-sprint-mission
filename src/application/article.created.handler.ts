import { ArticleCreatedEvent } from "../02-domain/event/article.event";
import { NotificationService } from "../02-domain/service/notification.service";

export class ArticleCreatedHandler {
  constructor(private notificationService: NotificationService) {}

  handle(event: ArticleCreatedEvent) {
    this.notificationService.send({
      toUserId: event.authorId,
      message: `Your article ${event.articleId} was created!`,
    });
  }
}
