import { BaseController } from "./base.controller.js";
import { CommentReqDto } from "./req-dto/comment.req.js";
import { ProductReqDto } from "./req-dto/product.req.dto.js";



export class ProductCommentController extends BaseController {
    #service

    constructor(service) {
        super('/product');
        this.#service = service;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:productId/comments', this.getCommentMiddleware);
        this.router.post('/:productId/comments', this.createCommmentMiddleware);
        this.router.patch('/:productId/comments/:commentId', this.updateCommentMiddleware);
        this.router.delete('/:productId/comments/:commentId', this.deleteCommentMiddleware);
    }

    getCommentMiddleware = async (req, res) => {
        const params = req.params;
        const query = req.query;
        const commentResDtos = await this.#service.getAllComments(params, query);
        return res.json(commentResDtos);
    }


    createCommmentMiddleware = async (req, res) => {
        const commentReqDto = new CommentReqDto({
            body: req.body,
            params: req.params
        }).validate();

        const commentResDto = await this.#service.createComment(commentReqDto);

        return res.status(201).json(commentResDto);
    }

    updateCommentMiddleware = async (req, res) => {
        const commentReqDto = new CommentReqDto({
            body: req.body,
            params: req.params
        }).validate();

        const updatedCommentResDto = await this.#service.updateComment(commentReqDto);

        res.status(200).json(updatedCommentResDto);
    }

    deleteCommentMiddleware = async (req, res) => {
        const id = req.params.commentId;
        await this.#service.deleteComment(id);
        res.status(200).json();
    }
}