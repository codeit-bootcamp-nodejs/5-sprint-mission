import { BaseController } from "./base.controller.js";
import { CommentReqDto } from "./req-dto/comment.req.js";



export class ArticleCommentController extends BaseController {
    #service
    #auth

    constructor(service, auth) {
        super('/article');
        this.#service = service;
        this.#auth = auth;

        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:articleId/comments', this.getArticleCommentMiddleware);
        this.router.post('/:articleId/comments', this.#auth.verifyAccessToken, this.createArticleCommmentMiddleware);
        this.router.patch('/:articleId/comments/:commentId', this.#auth.verifyAccessToken, this.updateArticleCommentMiddleware);
        this.router.delete('/:articleId/comments/:commentId', this.#auth.verifyAccessToken, this.deleteArticleCommentMiddleware);
    }

    getArticleCommentMiddleware = async (req, res) => {
        const articleId = req.params.articleId;
        const commentResDto = await this.#service.comment.getAllArticleComments(articleId);
        return res.json(commentResDto);
    }


    createArticleCommmentMiddleware = async (req, res) => {

        const commentReqDto = new CommentReqDto({
            body: req.body,
            params: req.params,
            userId: req.user.userId
        }).validate();

        const commentResDto = await this.#service.comment.createArticleComment(commentReqDto);

        return res.status(201).json(commentResDto);
    }

    updateArticleCommentMiddleware = async (req, res) => {
        const commentReqDto = new CommentReqDto({
            body: req.body, 
            params: req.params, 
            userId: req.user.userId
        }).validate();

        const updatedProductResDto = await this.#service.product.updateProduct(commentReqDto);

        res.status(200).json(updatedProductResDto);
    }

    deleteArticleCommentMiddleware = async (req, res) => {
        const id = req.params.id;
        await this.#service.product.deleteProduct(id);
        res.status(200).json();
    }
}