import { ArticleReqDto, QueryType } from "../../request/req.validator";
import { ArticleResDto } from "../../response/article.res.dto";

export interface IArticleService {
    getAllArticles(query: QueryType): Promise<ArticleResDto[]>;
    getArticle(id: string): Promise<ArticleResDto>
    createArticle(dto: ArticleReqDto): Promise<ArticleResDto>
    updateArticle(dto: ArticleReqDto): Promise<ArticleResDto>
    deleteArticle(id: string, userId: string): void
}