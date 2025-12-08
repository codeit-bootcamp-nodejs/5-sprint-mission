import { IArticleCommentService } from "./services/i.article.comment.service";
import { IArticleService } from "./services/i.article.service";
import { IProductCommentService } from "./services/i.product.comment.service";
import { IProductService } from "./services/i.product.service";
import { IUserService } from "./services/i.user.service";

export interface IService {
    product: IProductService,
    article: IArticleService,
    user: IUserService,
    articleComment:  IArticleCommentService,
    productComment: IProductCommentService,  
}
    