import { CreateArticleReqValidator } from "./req.validator/article/create.article.req.validator.js";
import { DeleteArticleReqValidator } from "./req.validator/article/delete.article.req.validator.js";
import { UpdateArticleReqValidator } from "./req.validator/article/update.article.req.validator.js";
import { GetArticleListReqValidator } from "./req.validator/article/get.article.list.req.validator.js";
import { GetArticleReqValidator } from "./req.validator/article/get.article.req.validator.js";
import { CreateArticleResDto } from "./res.dto/article/create.article.res.dto.js";
import { DeleteArticleResDto } from "./res.dto/article/delete.article.res.dto.js";
import { UpdateArticleResDto } from "./res.dto/article/update.article.res.dto.js";
import { GetArticleListResDto } from "./res.dto/article/get.article.list.res.dto.js";
import { GetArticleResDto } from "./res.dto/article/get.article.res.dto.js";

export class ArticleController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  createArticleController = async (req, res, next) => {
    const createArticleReqDto = new CreateArticleReqValidator({
      body: req.body,
      userId: req.userId,
    }).validate();
    const createdArticle =
      await this.#services.article.createArticle(createArticleReqDto);
    const createdArticleResDto = new CreateArticleResDto(createdArticle);
    return res.json(createdArticleResDto);
  };

  getArticleController = async (req, res, next) => {
    const getArticleReqDto = new GetArticleReqValidator({
      params: req.params,
    }).validate();
    const getArticle =
      await this.#services.article.getArticle(getArticleReqDto);
    const getArticleResDto = new GetArticleResDto(getArticle);
    return res.json(getArticleResDto);
  };

  getArticleListController = async (req, res, next) => {
    const getArticleListReqDto = new GetArticleListReqValidator({
      query: req.query,
    }).validate();
    const getArticleList =
      await this.#services.article.getArticleList(getArticleListReqDto);
    const getArticleListResDto = new GetArticleListResDto(getArticleList);
    return res.json(getArticleListResDto);
  };

  updateArticleController = async (req, res, next) => {
    const updateArticleReqDto = new UpdateArticleReqValidator({
      body: req.body,
      params: req.params,
      userId: req.userId,
    }).validate();
    const updatedArticle =
      await this.#services.article.updateArticle(updateArticleReqDto);
    const updatedArticleResDto = new UpdateArticleResDto(updatedArticle);
    return res.json(updatedArticleResDto);
  };

  deleteArticleController = async (req, res, next) => {
    const deleteArticleReqDto = new DeleteArticleReqValidator({
      body: req.body,
      params: req.params,
      userId: req.userId,
    }).validate();
    const deletedwArticle =
      await this.#services.article.deleteArticle(deleteArticleReqDto);
    const deletedArticleResDto = new DeleteArticleResDto(deletedwArticle);
    return res.json(deletedArticleResDto);
  };
}
