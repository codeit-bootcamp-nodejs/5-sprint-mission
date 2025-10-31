import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Authenticator, HttpError } from "../../external/authenticator";
import { IService } from "../../03-domain/I.service";
import { articleReqSchema, querySchema } from "../req-validator/req.validator";


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
        const result = querySchema.safeParse({query: req.query});
        if (result.success) {
            const articlesResDtos = await this.#service.articleService.getAllArticles(result.data);
            return res.json(articlesResDtos);
        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Query가 유효하지 않습니다";
            throw new HttpError(errorMessage, 404);
        }
    }

    getArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        const articleResDto = await this.#service.articleService.getArticle(id);
        return res.json(articleResDto);
    }

    createArticle = async (req: Request, res: Response) => {

        const result = articleReqSchema.safeParse({
            body: req.body,
            user: req.user,
            params: req.params
        })

      
        if (result.success) {
        
            const articleReqDto = result.data; // 
            const newarticleResDto = await this.#service.articleService.createArticle(articleReqDto);
            return res.status(201).json(newarticleResDto);

        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Query가 유효하지 않습니다";
            throw new HttpError(errorMessage, 401);
        }
    }

    updateArticle = async (req: Request, res: Response) => {
        const result = articleReqSchema.safeParse({
            body: req.body,
            user: req.user,
            params: req.params
        });

        if (result.success) {
            const articleReqDto = result.data;
            console.log(articleReqDto);
            const updatedarticleResDto = await this.#service.articleService.updateArticle(articleReqDto);
            res.status(200).json(updatedarticleResDto);
        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Query가 유효하지 않습니다";
            throw new HttpError(errorMessage, 401);
        }

    }

    deleteArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.#service.articleService.deleteArticle(id);
        res.status(200).json();
    }
}