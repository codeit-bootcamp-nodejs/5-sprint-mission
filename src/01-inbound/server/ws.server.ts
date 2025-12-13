import { AuthenticatorType } from "../../external/authenticator";
import { IEventBus } from "../port/I.eventbus";

export const createWsServer = (eventBus: IEventBus, auth: AuthenticatorType) => {

    const registerRoutes = () => {
        eventBus.articleComment.subscribe(sendArticleCommentNotification);
        // eventBus.subscribe((msg: object) => console.log("Product price changed :", msg))
    }

    
    const sendArticleCommentNotification = (msg: object) => {
        console.log("Article comment Received :", msg)
    }




    const run = () => {
        registerRoutes();
    }

    return { run };
}