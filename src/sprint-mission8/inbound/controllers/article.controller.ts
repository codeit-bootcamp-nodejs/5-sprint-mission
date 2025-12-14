import { BaseController, ControllerHandler } from "./base.controller";
import { createArticleReqSchema, deleteArticleReqSchema, getArticleListReqSchema, getArticleReqSchema, updateArticleReqSchema } from "../requests/article/article.req.schemas";
import { CreateArticleResDto } from "../responses/article/create.article.res.dto";
import { DeleteArticleResDto } from "../responses/article/delete.article.res.dto";
import { GetArticleListResDto } from "../responses/article/get.article.list.res.dto";
import { GetArticleResDto } from "../responses/article/get.article.res.dto";
import { UpdateArticleResDto } from "../responses/article/update.article.res.dto";
import { IServices } from "../port/services.interface";

export class ArticleController extends BaseController {

  constructor(services: IServices) {
    super(services);
  }

  createArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(createArticleReqSchema.safeParse({
      userId: req.userId,
      ...req.body
    }));
    const createdArticle =
      await this._services.article.createArticle(reqDto);
    const createdArticleResDto = new CreateArticleResDto(createdArticle);
    return res.json(createdArticleResDto);
  };

  getArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getArticleReqSchema.safeParse(
      req.params
    ));
    const getArticle =
      await this._services.article.getArticle(reqDto);
    const getArticleResDto = new GetArticleResDto(getArticle);
    return res.json(getArticleResDto);
  };

  getArticleListController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getArticleListReqSchema.safeParse(
      req.query
    ));
    const getArticleList =
      await this._services.article.getArticleList(reqDto);
    const getArticleListResDto = new GetArticleListResDto(getArticleList);
    return res.json(getArticleListResDto);
  };

  updateArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(updateArticleReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
      ...req.body
    }));
    const updatedArticle =
      await this._services.article.updateArticle(reqDto);
    const updatedArticleResDto = new UpdateArticleResDto(updatedArticle);
    return res.json(updatedArticleResDto);
  };

  deleteArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(deleteArticleReqSchema.safeParse({
      userId: req.userId,
      ...req.params
    }));
    await this._services.article.deleteArticle(reqDto);
    const deletedArticleResDto = new DeleteArticleResDto();
    return res.json(deletedArticleResDto);
  };
}
