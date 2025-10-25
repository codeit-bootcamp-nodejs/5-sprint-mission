import { BaseController } from "./base.controller.js";
import { ArticleReqDto } from "./req-dto/article.req.dto.js";


export class ArticleController extends BaseController {
    #service
    #auth

    constructor(service, auth) {
        super('/articles');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getArticlesMiddleware);
        this.router.get('/:id', this.getArticleMiddleware);
        this.router.post('/', this.#auth.verifyAccessToken, this.createArticleMiddleware);
        this.router.patch('/:id', this.#auth.verifyAccessToken, this.#auth.verifyArticleAuth, this.updateArticleMiddleware);
        this.router.delete('/:id', this.#auth.verifyAccessToken, this.#auth.verifyArticleAuth, this.deleteArticleMiddleware);
    }

    getArticlesMiddleware = async (req, res) => {
        const query = req.query;
        const articlesResDto = await this.#service.article.getAllArticles(query);
        return res.json(articlesResDto);
    }

    getArticleMiddleware = async (req, res) => {
        const id = req.params.id;
        const articleResDto = await this.#service.article.getArticle(id);
        return res.json(articleResDto);
    }

    createArticleMiddleware = async (req, res) => {
        const articleReqDto = new ArticleReqDto({ body: req.body, userId: req.user.userId }).validate();
        const newarticleResDto = await this.#service.article.createArticle(articleReqDto);

        return res.status(201).json(newarticleResDto);
    }

    updateArticleMiddleware = async (req, res) => {
        const articleReqDto = new ArticleReqDto({ body: req.body, params: req.params }).validate();
        const updatedarticleResDto = await this.#service.article.updateArticle(articleReqDto);

        res.status(200).json(updatedarticleResDto);
    }

    deleteArticleMiddleware = async (req, res) => {
        const id = req.params.id;
        await this.#service.article.deleteArticle(id);
        res.status(200).json();
    }
}