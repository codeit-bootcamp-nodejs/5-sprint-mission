import { ArticleRouter } from "./01-app/router/article.router";
import { ImageRouter } from "./01-app/router/image.router";
import { ProductRouter } from "./01-app/router/product.router";
import { UserRouter } from "./01-app/router/user.router";
import { Server } from "./01-app/server";
import { controllers } from "./02-controller/controllers";
import { managers } from "./common/util/managers";

export class DepInjector {
  private _sever: Server;

  constructor() {
    this._sever = this.injectDeps();
  }

  get server() {
    return this._sever;
  }

  injectDeps() {

    const userRouter = new UserRouter(controllers, managers);
    const productRouter = new ProductRouter(controllers, managers);
    const articleRouter = new ArticleRouter(controllers, managers);
    const imageRouter = new ImageRouter(controllers, managers);
    const routers = [userRouter, productRouter, articleRouter, imageRouter];

    return new Server({routers, managers});
  }
}
