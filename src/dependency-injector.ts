import { HttpServer } from "./server/server";
import { ArticleController } from "./01-inbound/controllers/article.controller";

import { ProductController } from "./01-inbound/controllers/product.controller";

import { ArticleService } from "./02-domain/service/article.service";


import { ProductService } from "./02-domain/service/product.service";


import { PrismaClient } from '@prisma/client';
import { ArticleRepository } from "./03-outbound/repo/article.repository";
import { ProductRepository } from "./03-outbound/repo/product.repository";
import { UserRepository } from "./03-outbound/repo/user.repository";
import { UserController } from "./01-inbound/controllers/user.controller";
import { UserService } from "./02-domain/service/user.service";
import { Authenticator } from "./external/authenticator";
import { ProductCommentService } from "./02-domain/service/product.comment.service";
import { ProductCommentRepository } from "./03-outbound/repo/product.comment.repository";
import { ProductCommentController } from "./01-inbound/controllers/product.comment.controller";
import { ArticleCommentRepository } from "./03-outbound/repo/article.comment.repository";
import { ArticleCommentService } from "./02-domain/service/article.comment.service";
import { ArticleCommentController } from "./01-inbound/controllers/article.comment.controller";
import { NotificationRepository } from "./03-outbound/repo/notification.repository";
import { NotificationGateway } from "./01-inbound/gateways/notification.gateway";
import { Gateways } from "./01-inbound/gateways";
import { WsServer } from "./server/ws.server";


export class DependencyInjector {
    public readonly httpServer: HttpServer;
    public readonly wsServer: WsServer;
    
    constructor() {
        const { httpServer, wsServer } = this.inject();
        this.httpServer = httpServer;
        this.wsServer = wsServer;
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
            notification: notificationRepository
        };


        const authenticator = new Authenticator(repos);


        // Service
        const userService = new UserService(repos, authenticator);
        const productService = new ProductService(repos);
        const articleService = new ArticleService(repos, authenticator);
        const productCommentService = new ProductCommentService(repos, authenticator);
        const articleCommentService = new ArticleCommentService(repos, authenticator);
        const services = {
            product: productService,
            article: articleService,
            user: userService,
            articleComment: articleCommentService,
            productComment: productCommentService,
        }


        // Controller
        const userController = new UserController(services, authenticator);
        const productController = new ProductController(services, authenticator);
        const articleController = new ArticleController(services, authenticator);
        const productcommentController = new ProductCommentController(services, authenticator);
        const articlecommentController = new ArticleCommentController(services, authenticator);
        const controllers = [
            productController, articleController,
            userController, productcommentController,
            articlecommentController
        ];



        // Gateway
        const notificationGateway = new NotificationGateway(services);
        const gateways = new Gateways(notificationGateway);

        // Server
        const httpServer = new HttpServer(controllers);
        const wsServer = new WsServer(
            httpServer.defaultHttpServer,
            gateways);
        return { httpServer, wsServer };
    }
}