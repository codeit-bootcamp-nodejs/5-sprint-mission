import { BaseController, ControllerHandler } from "./base.controller";
import { articleLikeReqSchema } from "../requests/article/article.req.schemas";
import { ArticleCommandService } from "../../application/command/service/article/article.command.service";

export class ArticleLikeController extends BaseController {
  constructor(private readonly _articleService: ArticleCommandService) {
    super();
  }

  addArticleLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      articleLikeReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
      }),
    );
    await this._articleService.likeArticle(reqDto);
    return res.sendStatus(200);
  };

  cancelArticleLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      articleLikeReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
      }),
    );

    await this._articleService.unlikeArticle(reqDto);
    return res.sendStatus(200);
  };
}
