import { PersistArticleEntity } from "../../../../domain/entity/article.entity";
import {
  CreateArticleDto,
  DeleteArticleDto,
  GetArticleDto,
  GetArticleListDto,
  GetLikedArticlesDto,
  UpdateArticleDto,
} from "../../../requests/article/article.req.schemas";

export interface IArticleService {
  getArticle(dto: GetArticleDto): Promise<PersistArticleEntity>;
  getArticleList(dto: GetArticleListDto): Promise<PersistArticleEntity[]>;
  likeArticle(dto: GetLikedArticlesDto): Promise<void>;
  unlikeArticle(dto: GetLikedArticlesDto): Promise<void>;
  createArticle(dto: CreateArticleDto): Promise<PersistArticleEntity>;
  updateArticle(dto: UpdateArticleDto): Promise<PersistArticleEntity>;
  deleteArticle(dto: DeleteArticleDto): Promise<void>;
}
