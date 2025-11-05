import { IArticleCommentService } from "./service/article.comment.service";
import { IArticleService } from "./service/article.service";
import { IProductCommentService } from "./service/product.comment.service";
import { IProductService } from "./service/product.service";

import { IUserService } from "./service/user.service";


export interface IService {
    productService: IProductService,
    articleService: IArticleService,
    userService: IUserService,
    articleCommentService:  IArticleCommentService,
    productCommentService: IProductCommentService
}