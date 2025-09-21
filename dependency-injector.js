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

        const repos = {
            productRepo: productRepository,
            articleRepo: articleRepository,
            commentRepo: commentRepository
        };

        // Service
        const productService = new ProductService(repos);
        const articleService = new ArticleService(repos);
        const commentService = new CommentService(repos);

        // Controller
        const productController = new ProductController(productService);
        const articleController = new ArticleController(articleService);
        const productCommentController = new ProductCommentController(commentService);
        const articleCommentController = new ArticleCommentController(commentService)
        const controllers = [productController, articleController, productCommentController, articleCommentController];

        // Server
        const server = new Server(controllers);
        return server;
    }

    get server() {
        return this.#server;
    }
}