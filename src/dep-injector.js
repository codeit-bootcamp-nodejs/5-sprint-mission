import { PrismaClient } from "@prisma/client";
import { Server } from "./sprint-mission3/01-app/server.js";
import { ProductController } from "./sprint-mission3/02-controller/product.controller.js";
import { ProductService } from "./sprint-mission3/03-domain/service/product.service.js";
import { ProductRepo } from "./sprint-mission3/04-repo/product.repo.js";
import { ProductMiddleware } from "./sprint-mission3/02-controller/midleware/product.middleware.js";

export class DepInjector {
  #sever;

  constructor() {
    this.#sever = this.injectDeps();
  }

  get _server() {
    return this.#sever;
  }

  injectDeps() {
    const prisma = new PrismaClient();
    
    const productRepo = new ProductRepo(prisma);
    
    const productService = new ProductService(productRepo);
    
    const productMiddleware = new ProductMiddleware(productService);
    
    const productController = new ProductController(productMiddleware);
    const controllers = [productController];

    return new Server(controllers);
  }
}
