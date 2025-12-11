import { HttpServer } from "./server/server";
import { createArticleController } from "./01-inbound/controllers/article.controller";

import { creatProductController } from "./01-inbound/controllers/product.controller";

import { createArticleService } from "./02-domain/service/article.service";


import { ProductService } from "./02-domain/service/product.service";


import { PrismaClient } from '@prisma/client';
import { ArticleRepository } from "./03-outbound/repo/article.repository";
import { ProductRepository } from "./03-outbound/repo/product.repository";
import { UserRepository } from "./03-outbound/repo/user.repository";
import { createUserController } from "./01-inbound/controllers/user.controller";
import { UserService } from "./02-domain/service/user.service";
import { Authenticator } from "./external/authenticator";
import { ProductCommentService } from "./02-domain/service/product.comment.service";
import { ProductCommentRepository } from "./03-outbound/repo/product.comment.repository";
import { createProductCommentController } from "./01-inbound/controllers/product.comment.controller";
import { ArticleCommentRepository } from "./03-outbound/repo/article.comment.repository";
import { createArticleCommentService } from "./02-domain/service/article.comment.service";
import { createArticleCommentController } from "./01-inbound/controllers/article.comment.controller";
import { EventBus } from "./application/event.bus";
import { NotificationRepository } from "./03-outbound/repo/notification.repository";

export class DependencyInjector {
    public readonly httpServer: HttpServer;

    constructor() {
        const httpServer = this.inject();
        this.httpServer = httpServer;
    }


    inject() {
        const prisma = new PrismaClient();

        // Repository
        const articleRepository = new ArticleRepository(prisma);
        const userRepository = new UserRepository(prisma);
        const productRepository = new ProductRepository(prisma);
        const productCommentRepository = new ProductCommentRepository(prisma);
        const articleCommentRepository = new ArticleCommentRepository(prisma);
        const notificationRepository = new NotificationRepository(prisma);
        const repos = {
            product: productRepository,
            article: articleRepository,
            user: userRepository,
            productComment: productCommentRepository,
            articleComment: articleCommentRepository,
            notification : notificationRepository
        };

        const authenticator = new Authenticator(repos);


        // Application 
        const eventBus = new EventBus();                     

        // Service
        const userService = new UserService(repos, authenticator);
        const productService = new ProductService(repos);
        const articleService = new createArticleService(repos);
        const productCommentService = new ProductCommentService(repos);
        const articleCommentService = new createArticleCommentService(repos, eventBus);



        // Controller
        const userController = new createUserController(userService, authenticator);
        const productController = new creatProductController(productService, authenticator);
        const articleController = new createArticleController(articleService, authenticator);
        const productcommentController = new createProductCommentController(productCommentService, authenticator);
        const articlecommentController = new createArticleCommentController(articleCommentService, authenticator);
        const controllers = [
            productController, articleController,
            userController, productcommentController,
            articlecommentController
        ];


        // Server
        const httpServer = new HttpServer(controllers);
        return httpServer;
    }
}