import { ArticleResDto } from "../../02-controller/res-dto/article.res.dto.js";
import { Article } from "../entity/article.js";


export class ArticleService {
    #repos
    constructor(repos) {
        this.#repos = repos;
    }

    async getAllArticles(query) {
        const articleEntities = await this.#repos.articleRepo.findAll(query);
        const articleDtos = articleEntities.map((entity) => new ArticleResDto(entity));
        return articleDtos;
    }

    async getArticle(id) {
        const articleEntity  = await this.#repos.articleRepo.findById(id);
        return new ArticleResDto(articleEntity);
    }

    async createArticle(dto) {
        const articleEntity = Article.forCreate(dto);

        const newarticle = await this.#repos.articleRepo.save(articleEntity);

        return new ArticleResDto(newarticle);
    }

    async updateArticle(dto) {
        console.log(dto);
        const articleEntity = Article.forCreate({
            id: dto.params.id,
            title: dto.title,
            content: dto.content ,
        });

        const updatedArticle = await this.#repos.articleRepo.updateById(articleEntity);
        return new ArticleResDto(updatedArticle);
    }


    async deleteArticle(id) {
        await this.#repos.articleRepo.deleteById(id);
    }
}