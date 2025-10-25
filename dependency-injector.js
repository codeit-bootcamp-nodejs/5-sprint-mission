import { Server } from "./01-server/server.js";
import { ArticleController } from "./02-controller/article.controller.js";
import { ArticleCommentController } from "./02-controller/article.comment.controller.js";

import { ProductController } from "./02-controller/product.controller.js";
import { ProductCommentController } from "./02-controller/product.comment.controller.js";
import { ArticleService } from "./03-domain/service/article.service.js";
import { CommentService } from "./03-domain/service/comment.service.js";

import { ProductService } from "./03-domain/service/product.service.js";


import { PrismaClient } from '@prisma/client';
import { CommentRepository } from "./04-repository/comment.repository.js";
import { ArticleRepository } from "./04-repository/article.repository.js";
import { ProductRepository } from "./04-repository/product.repository.js";
import { UserRepository } from "./04-repository/user.repository.js";
import { UserController } from "./02-controller/user.controller.js";
import { UserService } from "./03-domain/service/user.service.js";
import { Authenticator } from "./external/authenticator.js";


export class DependencyInjector {
    #server
    constructor() {
        this.#server = this.inject();
    }


    inject() {
        const prisma = new PrismaClient();

        // Repository
        const productRepository = new ProductRepository(prisma);
        const articleRepository = new ArticleRepository(prisma);
        const commentRepository = new CommentRepository(prisma);
        const userRepository = new UserRepository(prisma);

        const repos = {
            productRepo: productRepository,
            articleRepo: articleRepository,
            commentRepo: commentRepository,
            userRepo: userRepository
        };

        const authenticator = new Authenticator(repos);


        // Service
        const userService = new UserService(repos, authenticator);
        const productService = new ProductService(repos);
        const articleService = new ArticleService(repos);
        const commentService = new CommentService(repos);
        const services = {
            product: productService,
            article: articleService,
            comment: commentService,
            user: userService
        }


        // Controller
        const userController = new UserController(services, authenticator);
        const productController = new ProductController(services, authenticator);
        const articleController = new ArticleController(services, authenticator);
        const productCommentController = new ProductCommentController(services, authenticator);
        const articleCommentController = new ArticleCommentController(services, authenticator)
        const controllers = [productController, articleController, productCommentController, articleCommentController, userController];

        // Server
        const server = new Server(controllers);
        return server;
    }

    get server() {
        return this.#server;
    }
}