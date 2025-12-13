import { IServices } from "../domain/service/services";
import { BaseController, ControllerHandler } from "./base.controller";
import { createArticleReqSchema, deleteArticleReqSchema, getArticleListReqSchema, getArticleReqSchema, updateArticleReqSchema } from "./req.validator/article/article.req.schemas";
import { CreateArticleResDto } from "./res.dto/article/create.article.res.dto";
import { DeleteArticleResDto } from "./res.dto/article/delete.article.res.dto";
import { GetArticleListResDto } from "./res.dto/article/get.article.list.res.dto";
import { GetArticleResDto } from "./res.dto/article/get.article.res.dto";
import { UpdateArticleResDto } from "./res.dto/article/update.article.res.dto";

export interface IArticleController {
  createArticleController: ControllerHandler;
  getArticleController: ControllerHandler;
  getArticleListController: ControllerHandler;
  updateArticleController: ControllerHandler;
  deleteArticleController: ControllerHandler;
}

export class ArticleController extends BaseController implements IArticleController {

  constructor(services: IServices) {
    super(services);
  }

  createArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(createArticleReqSchema.safeParse({
      userId: req.userId,
      ...req.body
    }));
    const createdArticle =
      await this._articleService.createArticle(reqDto);
    const createdArticleResDto = new CreateArticleResDto(createdArticle);
    return res.json(createdArticleResDto);
  };

  getArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getArticleReqSchema.safeParse(
      req.params
    ));
    const getArticle =
      await this._articleService.getArticle(reqDto);
    const getArticleResDto = new GetArticleResDto(getArticle);
    return res.json(getArticleResDto);
  };

  getArticleListController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(getArticleListReqSchema.safeParse(
      req.query
    ));
    const getArticleList =
      await this._articleService.getArticleList(reqDto);
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
      await this._articleService.updateArticle(reqDto);
    const updatedArticleResDto = new UpdateArticleResDto(updatedArticle);
    return res.json(updatedArticleResDto);
  };

  deleteArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(deleteArticleReqSchema.safeParse({
      userId: req.userId,
      ...req.params
    }));
    await this._articleService.deleteArticle(reqDto);
    const deletedArticleResDto = new DeleteArticleResDto();
    return res.json(deletedArticleResDto);
  };
}
