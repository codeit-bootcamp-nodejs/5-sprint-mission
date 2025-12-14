import { IServices } from "../inbound/port/services.interface";
import { IArticleCommentService } from "../inbound/port/services/article/article-comment.service.interface";
import { IArticleService } from "../inbound/port/services/article/article.service.interface";
import { IAuthService } from "../inbound/port/services/auth.service.interface";
import { IProductCommentService } from "../inbound/port/services/product/product-comment.service.interface";
import { IProductService } from "../inbound/port/services/product/product.service.interface";
import { IUserService } from "../inbound/port/services/user.service.interface";


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
