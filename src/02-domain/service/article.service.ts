import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { Authenticator } from "../../external/authenticator";
import { Article, PersistArticleEntity } from "../entity/article";
import { IBaseRepository } from "../port/I.base.repository";
import { ArticleResDto } from "../../01-inbound/response/article.response";
import { ArticleCreatedEvent } from "../event/article.event";






export class ArticleService {
    #repos


    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }

    async getAllArticles(query: QueryType) {
        const articleEntities = await this.#repos.article.findAll(query);
        const articleResDtos = articleEntities.map((entity: PersistArticleEntity) => new ArticleResDto(entity));
        return articleResDtos;
    }

    async getArticle(id: string) {
        const articleEntity = await this.#repos.article.findById(id);
        return new ArticleResDto(articleEntity);
    }

    async createArticle(dto: ArticleReqDto) {
        const articleEntity = Article.createNew(dto);
        const newarticle = await this.#repos.article.save(articleEntity);;
        return new ArticleResDto(newarticle);
    }

    async updateArticle(dto: ArticleReqDto) {
        const { userId, id, title, content } = dto;
        if (!id) {
            throw new Error('Article ID is required for updating an article.');
        }

        const article = await this.#repos.article.findById(id);

        if (article.userId !== userId) {
            throw new Error('You are not authorized to update this article.');
        }

        article.update({
            title,
            content
        });

        const updatedArticle = await this.#repos.article.updateArticle(article);
        return new ArticleResDto(updatedArticle);
    }


    async deleteArticle(id: string, userId: string) {
        const article = await this.#repos.article.findById(id);
        if (!article) {
            throw new Error('Article not found.');
        }

        if (article.userId !== userId) {
            throw new Error('You are not authorized to delete this article.');
        }

        await this.#repos.article.deleteById(id);
    }
}