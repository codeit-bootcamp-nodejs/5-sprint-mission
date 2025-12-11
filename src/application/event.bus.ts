import { ArticleComment } from "../02-domain/entity/article.comment.entity";
import { PersistArticleComment } from "../03-outbound/repo/article.comment.repository";

export class EventBus {
    publish(event: object) {
        console.log(event);
    }
}
