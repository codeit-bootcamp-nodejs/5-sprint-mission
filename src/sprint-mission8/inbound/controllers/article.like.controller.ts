import { IServices } from "../domain/service/services";
import { BaseController, ControllerHandler } from "./base.controller";
import { articleLikeReqSchema } from "../requests/article/article.req.schemas";
import { ArticleLikeResDto } from "../responses/article/article.like.res.dto";

export class ArticleLikeController extends BaseController {

  constructor(services: IServices) {
    super(services);
  }

  addArticleLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(articleLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));
    const article = await this._articleService.addArticleLike(reqDto);
    const resDto = new ArticleLikeResDto(article);

    return res.json(resDto);
  };
  
  cancelArticleLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(articleLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    const article = await this._articleService.cancelArticleLike(reqDto);
    const resDto = new ArticleLikeResDto(article);

    return res.json(resDto);
  };
}
