import { ArticleLikeReqValidator } from "./req.validator/article/article.like.req.validator.js";
import { ArticleLikeResDto } from "./res.dto/article/article.like.res.dto.js";
import { GetArticleListResDto } from "./res.dto/article/get.article.list.res.dto.js";

export class ArticleLikeController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  addArticleLikeController = async (req, res, next) => {
    const reqDto = new ArticleLikeReqValidator({
      userId: req.userId,
      params: req.params,
    }).validate();

    const article = await this.#services.article.addArticleLike(reqDto);
    const resDto = new ArticleLikeResDto(article);

    return res.json(resDto);
  };
  cancelArticleLikeController = async (req, res, next) => {
    const reqDto = new ArticleLikeReqValidator({
      userId: req.userId,
      params: req.params,
    }).validate();

    const article = await this.#services.article.cancelArticleLike(reqDto);
    const resDto = new ArticleLikeResDto(article);

    return res.json(resDto);
  };
}
