import { BaseController, ControllerHandler } from "./base.controller";
import {
  createArticleReqSchema,
  deleteArticleReqSchema,
  getArticleListReqSchema,
  getArticleReqSchema,
  updateArticleReqSchema,
} from "../requests/article/article.req.schemas";
import { CreateArticleResDto } from "../responses/article/create.article.res.dto";
import { GetArticleListResDto } from "../responses/article/get.article.list.res.dto";
import { GetArticleResDto } from "../responses/article/get.article.res.dto";
import { UpdateArticleResDto } from "../responses/article/update.article.res.dto";
import { ArticleService } from "../../domain/service/article/article.service";

export class ArticleController extends BaseController {
  constructor(private readonly _articleService: ArticleService) {
    super();
  }

  createArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      createArticleReqSchema.safeParse({
        userId: req.userId,
        ...req.body,
      }),
    );
    const createdArticle = await this._articleService.createArticle(reqDto);
    const createdArticleResDto = new CreateArticleResDto(createdArticle);
    return res.json(createdArticleResDto);
  };

  getArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      getArticleReqSchema.safeParse(req.params),
    );
    const getArticle = await this._articleService.getArticle(reqDto);
    const getArticleResDto = new GetArticleResDto(getArticle);
    return res.json(getArticleResDto);
  };

  getArticleListController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      getArticleListReqSchema.safeParse(req.query),
    );
    const getArticleList = await this._articleService.getArticleList(reqDto);
    const getArticleListResDto = new GetArticleListResDto(getArticleList);
    return res.json(getArticleListResDto);
  };

  updateArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      updateArticleReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
        ...req.body,
      }),
    );
    const updatedArticle = await this._articleService.updateArticle(reqDto);
    const updatedArticleResDto = new UpdateArticleResDto(updatedArticle);
    return res.json(updatedArticleResDto);
  };

  deleteArticleController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      deleteArticleReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
      }),
    );
    await this._articleService.deleteArticle(reqDto);
    return res.sendStatus(200);
  };
}
