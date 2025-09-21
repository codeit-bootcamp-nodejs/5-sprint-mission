import { BaseController } from "./base.controller.js";
import { ProductReqDto } from "./req-dto/product.req.dto.js";


export class ArticleCommentController extends BaseController {
    #service

    constructor(service) {
        super('/article');
        this.#service = service;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:articleId/comments', this.getArticleCommentMiddleware);
        this.router.post('/:articleId/comments', this.createProductCommmentMiddleware);
        this.router.patch('/:articleId/comments/:commentId', this.updateArticleCommentMiddleware);
        this.router.delete('/:articleId/comments/:commentId', this.deleteArticleCommentMiddleware);
    }

    getArticleCommentMiddleware = async (req, res) => {
        const query = req.query;
        const productsResDto = await this.#service.getAllArticleComments(query);
        return res.json(productsResDto);
    }


    createProductCommmentMiddleware = async (req, res) => {
        const productReqDto = new ProductReqDto({ body: req.body }).validate();
        const newProductResDto = await this.#service.createProduct(productReqDto);

        return res.status(201).json(newProductResDto);
    }

    updateArticleCommentMiddleware = async (req, res) => {
        const productReqDto = new ProductReqDto({ body: req.body, params: req.params }).validate();
        const updatedProductResDto = await this.#service.updateProduct(productReqDto);

        res.status(200).json(updatedProductResDto);
    }

    deleteArticleCommentMiddleware = async (req, res) => {
        const id = req.params.id;
        await this.#service.deleteProduct(id);
        res.status(200).json();
    }
}