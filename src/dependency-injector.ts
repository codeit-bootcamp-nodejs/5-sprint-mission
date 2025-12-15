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
import { IBaseRepository } from "./02-domain/port/I.base.repository";

import { createArticleRepository } from "./03-outbound/repository/article.repository";
import { createArticleCommentRepository } from "./03-outbound/repository/article.comment.repository";
import { createNotificationRepository } from "./03-outbound/repository/notification.repository";
import { createProductRepository } from "./03-outbound/repository/product.repository";
import { createProductCommentRepository } from "./03-outbound/repository/product.comment.repository";
import { createProductLikeRepository } from "./03-outbound/repository/product.like.repository";
import { createUserRepository } from "./03-outbound/repository/user.repository";

import { Authenticator } from "./external/authenticator";
import { NotificationEventBus } from "./external/eventbus/notification.event.bus";
import { IEventBus } from "./01-inbound/port/I.eventbus";

export const DependencyInjector = () => {
  const inject = () => {
    const prisma = new PrismaClient();

    // Repositories
    const repos: IBaseRepository = {
      article: createArticleRepository(prisma),
      articleComment: createArticleCommentRepository(prisma),
      product: createProductRepository(prisma),
      productComment: createProductCommentRepository(prisma),
      productLike: createProductLikeRepository(prisma),
      user: createUserRepository(prisma),
      notification: createNotificationRepository(prisma),
    };

    // Authenticator
    const authenticator = Authenticator(repos);

    // Event Bus
    const notificationEventBus = NotificationEventBus();
    const eventBuses: IEventBus = {
      notification: notificationEventBus,
    };

    // Services
    const notificationService = createNotificationService(repos, eventBuses);
    const productService = createProductService(repos, eventBuses);
    const articleService = createArticleService(repos, eventBuses);
    const articleCommentService = createArticleCommentService(repos, eventBuses);
    const productCommentService = createProductCommentService(repos, eventBuses);
    const userService = createUserService(repos, authenticator, eventBuses);

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
      NotificationHandler(eventBuses),
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
