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
import { createArticleCommentCommandService } from "./02-application/command/service/article.comment.command.service";
import { createProductCommandService } from "./02-application/command/service/product.command.service";
import { createUserCommandService } from "./02-application/command/service/user.command.service";

import { Authenticator } from "./shared/authenticator/authenticator";
import { NotificationEventBus } from "./shared/eventbus/eventbuses/notification.event.bus";
import { createArticleCommentCommandRepository } from "./03-outbound/repository/command/article.comment.command.repository";
import { createNotificationCommandRepository } from "./03-outbound/repository/command/notification.command.repository";
import { createProductCommentCommandRepository } from "./03-outbound/repository/command/product.comment.command.repository";
import { createArticleCommandRepository } from "./03-outbound/repository/command/article.command.repository";
import { createProductCommandRepository } from "./03-outbound/repository/command/product.command.repository";
import { createProductLikeCommandRepository } from "./03-outbound/repository/command/product.like.command.repository";
import { createUserCommandRepository } from "./03-outbound/repository/command/user.command.repository";
import { createNotificationCommandService } from "./02-application/command/service/notification.command.service";
import { createArticleCommandService } from "./02-application/command/service/article.command.service";
import { createProductCommentCommandService } from "./02-application/command/service/product.comment.command.service";
import { createArticleCommentQueryService } from "./02-application/query/service/article.comment.query.service";
import { createArticleQueryService } from "./02-application/query/service/article.query.service";
import { createNotificationQueryService } from "./02-application/query/service/notification.query.service";
import { createProductCommentQueryService } from "./02-application/query/service/product.comment.query.service";
import { createProductQueryService } from "./02-application/query/service/product.query.service";
import { createArticleQueryRepository } from "./03-outbound/repository/query/article.query.repository";
import { createProductQueryRepository } from "./03-outbound/repository/query/product.query.repository";
import { createArticleCommentQueryRepository } from "./03-outbound/repository/query/article.comment.query.repository";
import { createProductCommentQueryRepository } from "./03-outbound/repository/query/product.comment.query.repository";
import { createUserQueryRepository } from "./03-outbound/repository/query/user.query.repository";
import { createNotificationQueryRepository } from "./03-outbound/repository/query/notification.query.repository";
import { createUserQueryService } from "./02-application/query/service/user.query.service";





export const DependencyInjector = () => {
  const inject = () => {
    const prisma = new PrismaClient();
    // ===== OutBound =====
    // Repositories
    const articleCommandRepository = createArticleCommandRepository(prisma);
    const articleCommentCommandRepository = createArticleCommentCommandRepository(prisma);
    const productCommandRepository = createProductCommandRepository(prisma);
    const productCommentCommandRepository = createProductCommentCommandRepository(prisma);
    const productLikeCommandRepository = createProductLikeCommandRepository(prisma);
    const userCommandRepository = createUserCommandRepository(prisma);
    const notificationCommandRepository = createNotificationCommandRepository(prisma);

    const articleQueryRepository = createArticleQueryRepository(prisma);
    const articleCommentQueryRepository = createArticleCommentQueryRepository(prisma);
    const productQueryRepository = createProductQueryRepository(prisma);
    const productCommentQueryRepository = createProductCommentQueryRepository(prisma);
    const userQueryRepository = createUserQueryRepository(prisma);
    const notificationQueryRepository = createNotificationQueryRepository(prisma);



    // ===== Shared =====
    // Authenticator
    const authenticator = Authenticator(userCommandRepository);

    // Event Buses
    const notificationEventBus = NotificationEventBus();


    // ===== Domain =====
    // Services
    const notificationCommandService = createNotificationCommandService(
      notificationCommandRepository,
      notificationEventBus
    );
    const productCommandService = createProductCommandService(
      productCommandRepository,
      productLikeCommandRepository,
      notificationCommandRepository,
      notificationEventBus
    );
    const articleCommandService = createArticleCommandService(
      articleCommandRepository,
      notificationEventBus
    );
    const articleCommentCommandService = createArticleCommentCommandService(
      articleCommandRepository,
      articleCommentCommandRepository,
      notificationCommandRepository,
      notificationEventBus
    );
    const productCommentCommandService = createProductCommentCommandService(
      productCommentCommandRepository,
      notificationEventBus
    );
    const userCommandService = createUserCommandService(
      userCommandRepository,
      productCommandRepository,
      authenticator,
      notificationEventBus
    );




    const notificationQueryService = createNotificationQueryService(
      notificationQueryRepository,
      notificationEventBus
    );
    const productQueryService = createProductQueryService(
      productQueryRepository
    );
    const articleQueryService = createArticleQueryService(
      articleQueryRepository,
      notificationEventBus
    );
    const articleCommentQueryService = createArticleCommentQueryService(
      articleCommentQueryRepository
    );
    const productCommentQueryService = createProductCommentQueryService(
      productCommentQueryRepository,
      notificationEventBus
    );
    const userQueryService = createUserQueryService(
      userQueryRepository,
      authenticator
    );





    // ===== Inbound =====
    // Controllers
    const controllers = [
      createProductController(productCommandService, productQueryService, authenticator),
      createArticleController(articleCommandService, articleQueryService, authenticator),
      createUserController(userCommandService, userQueryService, authenticator),
      createProductCommentController(productCommentCommandService, productCommentQueryService, authenticator),
      createArticleCommentController(articleCommentCommandService, articleCommentQueryService, authenticator),
      createNotificationController(notificationCommandService, notificationQueryService, authenticator),
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
