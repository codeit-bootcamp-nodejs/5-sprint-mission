import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Authenticator, HttpError } from "../../external/authenticator";
import { articleBodySchema, articleParamSchema, querySchema } from "../request/req.validator";
import { IService } from "../port/i.service";


export class ArticleController extends BaseController {
    #service
    #auth

    constructor(service: IService, auth: Authenticator) {
        super('/articles');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getArticles);
        this.router.get('/:id', this.getArticle);
        this.router.post('/', this.#auth.verifyAccessToken, this.createArticle);
        this.router.patch('/:id', this.#auth.verifyAccessToken, this.#auth.verifyArticleAuth, this.updateArticle);
        this.router.delete('/:id', this.#auth.verifyAccessToken, this.#auth.verifyArticleAuth, this.deleteArticle);
    }

    getArticles = async (req: Request, res: Response) => {
        const articleReqDto = this.validate(querySchema, req.query);
        const articlesResDtos = await this.#service.articleService.getAllArticles(articleReqDto);
        return res.json(articlesResDtos);
    }

    getArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        const articleResDto = await this.#service.articleService.getArticle(id);
        return res.json(articleResDto);
    }

    createArticle = async (req: Request, res: Response) => {
        const body = this.validate(articleBodySchema, req.body);
        const params = this.validate(articleParamSchema, req.params);

        const articleResDto = await this.#service.articleService.createArticle({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.status(201).json(articleResDto);
    }


    updateArticle = async (req: Request, res: Response) => {
        const body = this.validate(articleBodySchema, req.body);
        const params = this.validate(articleParamSchema, req.params);
        
        const articleResDto = await this.#service.articleService.updateArticle({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.status(200).json(articleResDto);
    }

    deleteArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.#service.articleService.deleteArticle(id);
        res.status(200).json();
    }
}