import { ArticleRouter } from "./routers/article.router";
import { ImageRouter } from "./routers/image.router";
import { ProductRouter } from "./routers/product.router";
import { UserRouter } from "./routers/user.router";

export class Routers {
  constructor(
    public readonly user: UserRouter,
    public readonly product: ProductRouter,
    public readonly article: ArticleRouter,
    public readonly image: ImageRouter
  ) { }
}