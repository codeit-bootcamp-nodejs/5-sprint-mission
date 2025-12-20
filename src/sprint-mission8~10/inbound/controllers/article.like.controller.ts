import { BaseController, ControllerHandler } from "./base.controller";
import { articleLikeReqSchema } from "../requests/article/article.req.schemas";
import { IServices } from "../port/services.interface";
import { LikeArticleResDto } from "../responses/article/like.article.res.dto";
import { UnlikeArticleResDto } from "../responses/article/unlike.article.res.dto";
import { ArticleService } from "../../domain/service/article/article.service";

export class ArticleLikeController extends BaseController {

  constructor(
    private readonly _articleService: ArticleService
  ) {
    super();
  }

  addArticleLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(articleLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));
    await this._articleService.likeArticle(reqDto);
    const resDto = new LikeArticleResDto();

    return res.json(resDto);
  };

  cancelArticleLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(articleLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    await this._articleService.unlikeArticle(reqDto);
    const resDto = new UnlikeArticleResDto();

    return res.json(resDto);
  };
}
