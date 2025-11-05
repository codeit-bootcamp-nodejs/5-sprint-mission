import { Server } from "./01-server/server";
import { ArticleController } from "./02-controller/controllers/article.controller";

import { ProductController } from "./02-controller/controllers/product.controller";

import { ArticleService } from "./03-domain/service/article.service";


import { ProductService } from "./03-domain/service/product.service";


import { PrismaClient } from '@prisma/client';
import { ArticleRepository } from "./04-repository/repo/article.repository";
import { ProductRepository } from "./04-repository/repo/product.repository";
import { UserRepository } from "./04-repository/repo/user.repository";
import { UserController } from "./02-controller/controllers/user.controller";
import { UserService } from "./03-domain/service/user.service";
import { Authenticator } from "./external/authenticator";
import { ProductCommentService } from "./03-domain/service/product.comment.service";
import { ProductCommentRepository } from "./04-repository/repo/product.comment.repository";
import { ProductCommentController } from "./02-controller/controllers/product.comment.controller";
import { ArticleCommentRepository } from "./04-repository/repo/article.comment.repository";
import { ArticleCommentService } from "./03-domain/service/article.comment.service";
import { ArticleCommentController } from "./02-controller/controllers/article.comment.controller";


export class DependencyInjector {
    #server
    constructor() {
        this.#server = this.inject();
    }


    inject() {
        const prisma = new PrismaClient();

        // Repository
        const articleRepository = new ArticleRepository(prisma);
        const userRepository = new UserRepository(prisma);
        const productRepository = new ProductRepository(prisma);
        const productCommentRepository = new ProductCommentRepository(prisma);
        const articleCommentRepository = new ArticleCommentRepository(prisma);

        const repos = {
            productRepo: productRepository,
            articleRepo: articleRepository,
            userRepo: userRepository,
            productCommentRepo: productCommentRepository,
            articleCommentRepo: articleCommentRepository
        };

        const authenticator = new Authenticator(repos);


        // Service
        const userService = new UserService(repos, authenticator);
        const productService = new ProductService(repos);
        const articleService = new ArticleService(repos, authenticator);
        const productCommentService = new ProductCommentService(repos, authenticator);
        const articleCommentService = new ArticleCommentService(repos, authenticator);

        const services = {
            productService: productService,
            articleService: articleService,
            userService: userService,
            articleCommentService: articleCommentService,
            productCommentService: productCommentService
        }


        // Controller
        const userController = new UserController(services, authenticator);
        const productController = new ProductController(services, authenticator);
        const articleController = new ArticleController(services, authenticator);
        const productcommentController = new ProductCommentController(services, authenticator);
        const articlecommentController = new ArticleCommentController(services, authenticator);

        const controllers = [productController, articleController, userController, productcommentController, articlecommentController];

        // Server
        const server = new Server(controllers);
        return server;
    }

    get server() {
        return this.#server;
    }
}