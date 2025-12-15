import { PrismaClient } from "@prisma/client";
import { createRepository, IRepository } from "./outbound/repository";
import { createService, IService } from "./domain/service";
import { ConfigUtil, IConfigUtil } from "./shared/config";
import {
  GlobalErrorMiddleware,
  defaultNotFoundMiddleware,
} from "./inbound/middlewares/errors";
import { Middlewares } from "./inbound/middlewares";
import { createControllers } from "./inbound/controller";

export interface Injected {
  prisma: PrismaClient;
  repository: IRepository;
  service: IService;
  configUtil: IConfigUtil;
  middlewares: Middlewares;
  globalError: GlobalErrorMiddleware;
  defaultError: defaultNotFoundMiddleware;
  controllers: ReturnType<typeof createControllers>;
}

export const inject = (): Injected => {
  const prisma = new PrismaClient();
  const repository = createRepository(prisma);
  const service = createService(repository);
  const configUtil = new ConfigUtil();

  const globalError = new GlobalErrorMiddleware(configUtil);
  const defaultError = new defaultNotFoundMiddleware();
  const middlewares = new Middlewares(prisma, globalError, defaultError);
  const controllers = createControllers(middlewares, service, configUtil);

  return {
    prisma,
    repository,
    service,
    configUtil,
    middlewares,
    globalError,
    defaultError,
    controllers,
  };
};
