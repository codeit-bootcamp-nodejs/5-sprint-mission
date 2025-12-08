import { IArticleService } from "../../01-inbound/port/services/i.article.service";
import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { ArticleResDto } from "../../01-inbound/response/article.res.dto";
import { IBaseRepository } from "../../03-outbound/I.base.repository";
import { Authenticator } from "../../external/authenticator";
import { Article } from "../entity/article";






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