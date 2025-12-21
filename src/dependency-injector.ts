import { PrismaClient } from "@prisma/client";

import { createHttpServer } from "./01-inbound/server/http.server";
import { createWsServer } from "./01-inbound/server/ws.server";

import { createArticleController } from "./01-inbound/controllers/article.controller";
import { createArticleCommentController } from "./01-inbound/controllers/article.comment.controller";
import { createNotificationController } from "./01-inbound/controllers/notification.controller";
import { createProductController } from "./01-inbound/controllers/product.controller";
import { createProductCommentController } from "./01-inbound/controllers/product.comment.controller";
import { createUserController } from "./01-inbound/controllers/user.controller";

import { NotificationHandler } from "./01-inbound/eventhandlers/notification.handler";

import { createArticleService } from "./02-domain/service/article.service";
import { createArticleCommentService } from "./02-domain/service/article.comment.service";
import { createNotificationService } from "./02-domain/service/notification.service";
import { createProductService } from "./02-domain/service/product.service";
import { createProductCommentService } from "./02-domain/service/product.comment.service";
import { createUserService } from "./02-domain/service/user.service";

import { createArticleRepository } from "./03-outbound/repository/article.repository";
import { createArticleCommentRepository } from "./03-outbound/repository/article.comment.repository";
import { createNotificationRepository } from "./03-outbound/repository/notification.repository";
import { createProductRepository } from "./03-outbound/repository/product.repository";
import { createProductCommentRepository } from "./03-outbound/repository/product.comment.repository";
import { createProductLikeRepository } from "./03-outbound/repository/product.like.repository";
import { createUserRepository } from "./03-outbound/repository/user.repository";

import { NotificationEventBus } from "./shared/eventbus/eventbuses/notification.event.bus";
import { Authenticator } from "./shared/authenticator/authenticator";


export const DependencyInjector = () => {
  const inject = () => {
    const prisma = new PrismaClient();
    // ===== OutBound =====
    // Repositories
    const articleRepository = createArticleRepository(prisma);
    const articleCommentRepository = createArticleCommentRepository(prisma);
    const productRepository = createProductRepository(prisma);
    const productCommentRepository = createProductCommentRepository(prisma);
    const productLikeRepository = createProductLikeRepository(prisma);
    const userRepository = createUserRepository(prisma);
    const notificationRepository = createNotificationRepository(prisma);

    // ===== Shared =====
    // Authenticator
    const authenticator = Authenticator(userRepository);

    // Event Buses
    const notificationEventBus = NotificationEventBus();


    // ===== Domain =====
    // Services
    const notificationService = createNotificationService(
      notificationRepository,
      notificationEventBus
    );
    const productService = createProductService(
      productRepository,
      productLikeRepository,
      notificationRepository,
      notificationEventBus
    );
    const articleService = createArticleService(
      articleRepository,
      notificationEventBus
    );
    const articleCommentService = createArticleCommentService(
      articleRepository,
      articleCommentRepository,
      notificationRepository,
      notificationEventBus
    );
    const productCommentService = createProductCommentService(
      productCommentRepository,
      notificationEventBus
    );
    const userService = createUserService(
      userRepository,
      productRepository,
      authenticator,
      notificationEventBus
    );


    // ===== Inbound =====
    // Controllers
    const controllers = [
      createProductController(productService, authenticator),
      createArticleController(articleService, authenticator),
      createUserController(userService, authenticator),
      createProductCommentController(productCommentService, authenticator),
      createArticleCommentController(articleCommentService, authenticator),
      createNotificationController(notificationService, authenticator),
    ];

    // Event Handlers
    const eventHandlers = [
      NotificationHandler(notificationEventBus),
    ];

    // Servers
    const httpServer = createHttpServer(controllers);
    const wsServer = createWsServer(
      httpServer.defaultHttpServer,
      eventHandlers,
    );

    return { httpServer, wsServer };
  };

  const { httpServer, wsServer } = inject();
  return { httpServer, wsServer };
};
