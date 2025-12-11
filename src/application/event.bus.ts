import { ArticleComment } from "../02-domain/entity/article.comment.entity";
import { PersistArticleComment } from "../03-outbound/repo/article.comment.repository";

export const EventBus = () => {
    const publish = (event: object) => {
        console.log(event);
    }

    return {
        publish
    }
}


export type EventBusType = ReturnType<typeof EventBus>;
