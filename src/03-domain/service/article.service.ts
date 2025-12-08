import { ArticleReqDto, QueryType } from "../../02-controller/req-validator/req.validator";
import { ArticleResDto } from "../../02-controller/res-dto/article.res.dto";
import { IBaseRepository } from "../../04-repository/I.base.repository";
import { Authenticator } from "../../external/authenticator";
import { Article } from "../entity/article";




export interface IArticleService {

    getAllArticles(query: QueryType): Promise<ArticleResDto[]>;

    getArticle(id: string): Promise<ArticleResDto>

    createArticle(dto: ArticleReqDto): Promise<ArticleResDto>

    updateArticle(dto: ArticleReqDto): Promise<ArticleResDto>

    deleteArticle(id: string): void
}

export class ArticleService implements IArticleService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }

    async getAllArticles(query: QueryType) {
        const articleEntities = await this.#repos.articleRepo.findAll(query);
        const articleResDtos: ArticleResDto[] = articleEntities.map((entity: Article) => new ArticleResDto(entity));
        return articleResDtos;
    }

    async getArticle(id: string) {
        const articleEntity = await this.#repos.articleRepo.findById(id);
        return new ArticleResDto(articleEntity);
    }

    async createArticle(dto: ArticleReqDto) {

        const newarticle = await this.#repos.articleRepo.save(dto);

        return new ArticleResDto(newarticle);
    }

    async updateArticle(dto: ArticleReqDto) {

        const updatedArticle = await this.#repos.articleRepo.updateById(dto);
        return new ArticleResDto(updatedArticle);
    }


    async deleteArticle(id: string) {
        await this.#repos.articleRepo.deleteById(id);
    }
}