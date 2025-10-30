import { BaseController } from "./base.controller.js";
import { CommentReqDto } from "./req-dto/comment.req.js";
import { ProductReqDto } from "./req-dto/product.req.dto.js";



export class ProductCommentController extends BaseController {
    #service
    #auth

    constructor(service, auth) {
        super('/product');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:productId/comments', this.getCommentMiddleware);
        this.router.post('/:productId/comments', this.#auth.verifyAccessToken, this.createCommmentMiddleware);
        this.router.patch('/:productId/comments/:commentId', this.#auth.verifyAccessToken, this.#auth.verifyCommentAuth, this.updateCommentMiddleware);
        this.router.delete('/:commentId', this.#auth.verifyAccessToken, this.#auth.verifyCommentAuth, this.deleteCommentMiddleware);
    }

    getCommentMiddleware = async (req, res) => {
        const params = req.params;
        const query = req.query;

        const commentResDtos = await this.#service.comment.getAllComments(params, query);
        return res.json(commentResDtos);
    }


    createCommmentMiddleware = async (req, res) => {
        const commentReqDto = new CommentReqDto({
            body: req.body,
            params: req.params,
            userId: req.user.userId
        }).validate();

        const commentResDto = await this.#service.comment.createComment(commentReqDto);

        return res.status(201).json(commentResDto);
    }

    updateCommentMiddleware = async (req, res) => {
        const commentReqDto = new CommentReqDto({
            body: req.body,
            params: req.params
        }).validate();

        const updatedCommentResDto = await this.#service.comment.updateComment(commentReqDto);

        res.status(200).json(updatedCommentResDto);
    }

    deleteCommentMiddleware = async (req, res) => {
        const id = req.params.commentId;
        await this.#service.comment.deleteComment(id);
        res.status(200).json();
    }
}