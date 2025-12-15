import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
} from "../structs/articles-structs";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import { IdParamsStruct } from "../structs/common-structs";
import { IService } from "../../domain/service";
import BadRequestError from "../../shared/errors/BadRequestError";
import { IArticleController } from "../controller";
import { Middlewares } from "../middlewares";
import { IConfigUtil } from "../../shared/config";
import { mapArticle } from "../mappers/article-mapper";

export class ArticleController
  extends BaseController
  implements IArticleController
{
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/article", middlewares, service, configUtils);
    this.register();
  }
  register() {
    this.router.post(
      "/",
      this.middlewares.auth({ optional: true }),
      this.catch(this.createArticle),
    );
    this.router.get(
      "/",
      this.middlewares.auth({ optional: false }),
      this.catch(this.getArticles),
    );
    this.router.get(
      "/:id",
      this.middlewares.auth({ optional: false }),
      this.catch(this.getArticleDetail),
    );
    this.router.patch(
      "/:id",
      this.middlewares.auth({ optional: true }),
      this.catch(this.updateArticle),
    );
    this.router.delete(
      "/:id",
      this.middlewares.auth({ optional: true }),
      this.catch(this.deleteArticle),
    );
    this.router.post(
      "/:id/like",
      this.middlewares.auth({ optional: true }),
      this.catch(this.likeArticle),
    );
    this.router.patch(
      "/:id/like",
      this.middlewares.auth({ optional: true }),
      this.catch(this.unlikeArticle),
    );
    this.router.get(
      "/me",
      this.middlewares.auth({ optional: true }),
      this.catch(this.getMyArticles),
    );
    this.router.get(
      "/favorites/me",
      this.middlewares.auth({ optional: true }),
      this.catch(this.getMyFavoriteArticles),
    );
  }

  createArticle = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = this.validate(CreateArticleBodyStruct, req.body);
    const article = await this.service.article.createArticle(userId, data);
    res
      .status(201)
      .json({ message: "게시글이 등록되었습니다", data: mapArticle(article) });
  };

  getArticles = async (req: Request, res: Response) => {
    const articles = await this.service.article.getArticles(req.query);
    res.json(articles.map(mapArticle));
  };

  getArticleDetail = async (req: Request, res: Response) => {
    const { id } = this.validate(IdParamsStruct, req.params);
    if (isNaN(id)) {
      throw new BadRequestError("유효하지 않은 게시글 ID입니다");
    }

    const article = await this.service.article.getArticleById(id);
    res.json(mapArticle(article));
  };

  updateArticle = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { id } = this.validate(IdParamsStruct, req.params);
    const data = this.validate(UpdateArticleBodyStruct, req.body);

    const updatedArticle = await this.service.article.updateArticle(
      id,
      userId,
      data,
    );

    res.status(200).json(mapArticle(updatedArticle));
  };

  deleteArticle = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = this.validate(IdParamsStruct, req.params);

    await this.service.article.deleteArticle(id, userId);
    res.status(200).json({ message: "게시글이 삭제되었습니다" });
  };

  likeArticle = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    if (!userId) {
      throw new Error();
    }
    const { id } = this.validate(IdParamsStruct, req.params);
    const result = await this.service.article.likeArticle(id, userId);
    res.status(200).json(result);
  };

  unlikeArticle = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    if (!userId) {
      throw new Error();
    }

    const { id } = this.validate(IdParamsStruct, req.params);

    const result = await this.service.article.unlikeArticle(id, userId);
    res.status(200).json(result);
  };

  getMyArticles = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    if (!userId) {
      throw new Error("인증이 필요합니다.");
    }
    const query = req.query;

    const articles = await this.service.article.loadMyArticles(userId, query);

    res.status(200).json(articles.map(mapArticle));
  };

  getMyFavoriteArticles = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const query = req.query;
    const articles = await this.service.article.getFavoriteArticles(
      userId,
      query,
    );

    res.status(200).json(articles.map(mapArticle));
  };
}
