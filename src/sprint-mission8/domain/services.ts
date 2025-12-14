import { IServices } from "../inbound/port/services.interface";
import { IArticleCommentService } from "../inbound/port/services/article/article-comment.service.interface";
import { IProductCommentService } from "../inbound/port/services/product-comment.service.interface";
import { IUserService } from "../inbound/port/services/user.service.interface";
import { IArticleService } from "./service/article/article.service";
import { IAuthService } from "./service/auth.service";
import { IProductService } from "./service/product/product.service";


export class Services implements IServices {
  constructor(
    public readonly user: IUserService,
    public readonly auth: IAuthService,
    public readonly article: IArticleService,
    public readonly articleComment: IArticleCommentService,
    public readonly product: IProductService,
    public readonly productComment: IProductCommentService,
  ) { }
};
