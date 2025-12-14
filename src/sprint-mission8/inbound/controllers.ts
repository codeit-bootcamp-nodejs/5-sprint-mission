import { ArticleCommentController } from "./controllers/article.comment.controller";
import { ArticleController } from "./controllers/article.controller";
import { ArticleLikeController } from "./controllers/article.like.controller";
import { ImageController } from "./controllers/image.controller";
import { ProductCommentController } from "./controllers/product.comment.controller";
import { ProductController } from "./controllers/product.controller";
import { ProductLikeController } from "./controllers/product.like.controller";
import { UserController } from "./controllers/user.controller"

export class Controllers {
  constructor(
    public readonly user: UserController,
    public readonly product: ProductController,
    public readonly productComment: ProductCommentController,
    public readonly productLike: ProductLikeController,
    public readonly article: ArticleController,
    public readonly articleComment: ArticleCommentController,
    public readonly articleLike: ArticleLikeController,
    public readonly image: ImageController
  ) { }
}