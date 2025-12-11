import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { Authenticator } from "../../external/authenticator";
import { Article, PersistArticleEntity } from "../entity/article";
import { IBaseRepository } from "../port/I.base.repository";
import { ArticleResDto } from "../../01-inbound/response/article.response";
import { ArticleCreatedEvent } from "../event/article.event";
import { EventBus } from "../../application/event.bus";






export const createArticleService =(repos: IBaseRepository) => {



    const getAllArticles = async (query: QueryType) => {
        const articleEntities = await repos.article.findAll(query);
        const articleResDtos = articleEntities.map((entity: PersistArticleEntity) => new ArticleResDto(entity));
        return articleResDtos;
    }

    const getArticle = async (id: string) => {
        const articleEntity = await repos.article.findById(id);
        return new ArticleResDto(articleEntity);
    }

    const createArticle = async (dto: ArticleReqDto) => {
        const articleEntity = Article.createNew(dto);
        const newarticle = await repos.article.save(articleEntity);

        return new ArticleResDto(newarticle);
    }

    const updateArticle = async (dto: ArticleReqDto) => {
        const { userId, id, title, content } = dto;
        if (!id) {
            throw new Error('Article ID is required for updating an article.');
        }

        const article = await repos.article.findById(id);

        if (article.userId !== userId) {
            throw new Error('You are not authorized to update this article.');
        }

        article.update({
            title,
            content
        });

        const updatedArticle = await repos.article.updateArticle(article);
        return new ArticleResDto(updatedArticle);
    }


    const deleteArticle = async (id: string, userId: string) => {
        const article = await repos.article.findById(id);
        if (!article) {
            throw new Error('Article not found.');
        }

        if (article.userId !== userId) {
            throw new Error('You are not authorized to delete this article.');
        }

        await repos.article.deleteById(id);
    }

    return { 
        getAllArticles,
        getArticle,
        createArticle,
        updateArticle,
        deleteArticle
    }
}

export type ArticleServiceType = ReturnType<typeof createArticleService>;