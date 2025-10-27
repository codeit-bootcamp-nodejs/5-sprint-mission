import { CreateArticleReqValidator } from "./req.validator/article/create.article.req.validator.js";
import { DeleteArticleReqValidator } from "./req.validator/article/delete.article.req.validator.js";
import { UpdateArticleReqValidator } from "./req.validator/article/update.article.req.validator.js";
import { ViewArticleListReqValidator } from "./req.validator/article/view.article.list.req.validator.js";
import { ViewArticleReqValidator } from "./req.validator/article/view.article.req.validator.js";
import { CreateArticleResDto } from "./res.dto/article/create.article.res.dto.js";
import { DeleteArticleResDto } from "./res.dto/article/delete.article.res.dto.js";
import { UpdateArticleResDto } from "./res.dto/article/update.article.res.dto.js";
import { ViewArticleListResDto } from "./res.dto/article/view.article.list.res.dto.js";
import { ViewArticleResDto } from "./res.dto/article/view.article.res.dto.js";

export class ArticleController {
  #articleService;

  constructor(articleService) {
    this.#articleService = articleService;
  }

  createArticleController = async (req, res, next) => {
    const createArticleReqDto = new CreateArticleReqValidator({
      body: req.body,
    }).validate();
    const createdArticle =
      await this.#articleService.createArticle(createArticleReqDto);
    const createdArticleResDto = new CreateArticleResDto(createdArticle);
    return res.json(createdArticleResDto);
  };

  viewArticleController = async (req, res, next) => {
    const viewArticleReqDto = new ViewArticleReqValidator({
      params: req.params,
    }).validate();
    const viewArticle =
      await this.#articleService.viewArticle(viewArticleReqDto);
    const viewArticleResDto = new ViewArticleResDto(viewArticle);
    return res.json(viewArticleResDto);
  };

  viewArticleListController = async (req, res, next) => {
    const viewArticleListReqDto = new ViewArticleListReqValidator({
      query: req.query,
    }).validate();
    const viewArticleList = await this.#articleService.viewArticleList(
      viewArticleListReqDto,
    );
    const viewArticleListResDto = new ViewArticleListResDto(viewArticleList);
    return res.json(viewArticleListResDto);
  };

  updateArticleController = async (req, res, next) => {
    const updateArticleReqDto = new UpdateArticleReqValidator({
      body: req.body,
      params: req.params,
    }).validate();
    const updatedArticle =
      await this.#articleService.updateArticle(updateArticleReqDto);
    const updatedArticleResDto = new UpdateArticleResDto(updatedArticle);
    return res.json(updatedArticleResDto);
  };

  deleteArticleController = async (req, res, next) => {
    const deleteArticleReqDto = new DeleteArticleReqValidator({
      body: req.body,
      params: req.params,
    }).validate();
    const deletedwArticle =
      await this.#articleService.deleteArticle(deleteArticleReqDto);
    const deletedArticleResDto = new DeleteArticleResDto(deletedwArticle);
    return res.json(deletedArticleResDto);
  };
}
