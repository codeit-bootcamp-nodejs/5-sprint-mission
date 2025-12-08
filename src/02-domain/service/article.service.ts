import { IArticleService } from "../../01-inbound/port/services/i.article.service";
import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { ArticleResDto } from "../../01-inbound/response/article.res.dto";
import { Authenticator } from "../../external/authenticator";
import { Article } from "../entity/article";
import { IBaseRepository } from "../port/I.base.repository";






export class ArticleService implements IArticleService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }

    async getAllArticles(query: QueryType) {
        const articleEntities = await this.#repos.article.findAll(query);
        const articleResDtos = articleEntities.map((entity: Article) => new ArticleResDto(entity));
        return articleResDtos;
    }

    async getArticle(id: string) {
        const articleEntity = await this.#repos.article.findById(id);
        return new ArticleResDto(articleEntity);
    }

    async createArticle(dto: ArticleReqDto) {

        const newarticle = await this.#repos.article.save(dto);

        return new ArticleResDto(newarticle);
    }

    async updateArticle(dto: ArticleReqDto) {

        const updatedArticle = await this.#repos.article.updateById(dto);
        return new ArticleResDto(updatedArticle);
    }


    async deleteArticle(id: string) {
        await this.#repos.article.deleteById(id);
    }
}