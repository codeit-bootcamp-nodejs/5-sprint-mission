type Handler<T> = (event: T) => void;

export const ArticleCommentEventBus = () => {
    let notifications: Handler<any> = () => { };

    const subscribe = <T>(callback: Handler<T>) => {
        notifications = callback;
    }

    const publish = (event: object) => {
        notifications(event);
    }
    
    return {
        subscribe,
        publish
    }
}

export type ArticleCommentEventBusType = ReturnType<typeof ArticleCommentEventBus>;