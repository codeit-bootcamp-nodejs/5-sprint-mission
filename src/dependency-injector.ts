import { createArticleController } from "./01-inbound/controllers/article.controller";
import { createArticleService } from "./02-domain/service/article.service";
import { PrismaClient } from '@prisma/client';
import { createArticleRepository } from "./03-outbound/repo/article.repository";
import { createProductRepository } from "./03-outbound/repo/product.repository";
import { createUserRepository } from "./03-outbound/repo/user.repository";
import { createUserController } from "./01-inbound/controllers/user.controller";
import { Authenticator } from "./external/authenticator";
import { createProductCommentRepository } from "./03-outbound/repo/product.comment.repository";
import { createProductCommentController } from "./01-inbound/controllers/product.comment.controller";
import { createArticleCommentRepository } from "./03-outbound/repo/article.comment.repository";
import { createArticleCommentService } from "./02-domain/service/article.comment.service";
import { createArticleCommentController } from "./01-inbound/controllers/article.comment.controller";
import { createNotificationRepository } from "./03-outbound/repo/notification.repository";
import { createUserService } from "./02-domain/service/user.service";
import { createProductService } from "./02-domain/service/product.service";
import { createProductCommentService } from "./02-domain/service/product.comment.service";
import { createProductController } from "./01-inbound/controllers/product.controller";
import { IBaseRepository } from "./02-domain/port/I.base.repository";
import { createWsServer } from "./01-inbound/server/ws.server";
import { createHttpServer } from "./01-inbound/server/http.server";
import { createNotificationController } from "./01-inbound/controllers/notification.controller";
import { createNotificationService } from "./02-domain/service/notification.service";
import { ArticleCommentEventBus } from "./03-outbound/eventhandler/article.comment.event.bus";

export const DependencyInjector = () => {
    const inject = () => {
        const prisma = new PrismaClient();

        // Repository
        const articleRepository = createArticleRepository(prisma);
        const userRepository = createUserRepository(prisma);
        const productRepository = createProductRepository(prisma);
        const productCommentRepository = createProductCommentRepository(prisma);
        const articleCommentRepository = createArticleCommentRepository(prisma);
        const notificationRepository = createNotificationRepository(prisma);
        const repos: IBaseRepository = {
            product: productRepository,
            article: articleRepository,
            user: userRepository,
            productComment: productCommentRepository,
            articleComment: articleCommentRepository,
            notification: notificationRepository
        };

        const authenticator = Authenticator(repos);


        // Application 
        const articleCommentEventBus = ArticleCommentEventBus();
        const eventBuses = {
            articleComment: articleCommentEventBus
        }


        // Service
        const userService = createUserService(repos, authenticator);
        const productService = createProductService(repos);
        const articleService = createArticleService(repos);
        const productCommentService = createProductCommentService(repos);
        const articleCommentService = createArticleCommentService(repos, articleCommentEventBus);
        const notificationService = createNotificationService(repos);



        // Controller
        const userController = createUserController(userService, authenticator);
        const productController = createProductController(productService, authenticator);
        const articleController = createArticleController(articleService, authenticator);
        const productcommentController = createProductCommentController(productCommentService, authenticator);
        const articlecommentController = createArticleCommentController(articleCommentService, authenticator);
        const notificationControler = createNotificationController(notificationService, authenticator);

        const controllers = [
            productController, articleController,
            userController, productcommentController,
            articlecommentController,
            notificationControler
        ];


        // Server
        const httpServer = createHttpServer(controllers);
        const wsServer = createWsServer(eventBuses, authenticator);

        return { httpServer, wsServer };
    }

    const { httpServer, wsServer } = inject();
    return { httpServer, wsServer };
}