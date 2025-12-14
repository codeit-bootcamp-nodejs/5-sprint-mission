import { PersitstProductCommentEntity } from "../../../../domain/entity/comment/product-comment.entity";
import { CreateProductCommentDto, GetProductCommentDto, UpdateProductCommentDto } from "../../../requests/product/product.req.schemas";

export interface IProductCommentService {
  getCommentList(dto: GetProductCommentDto): Promise<PersitstProductCommentEntity[]>;
  createComment(dto: CreateProductCommentDto): Promise<PersitstProductCommentEntity>;
  updateComment(dto: UpdateProductCommentDto): Promise<PersitstProductCommentEntity>;
  deleteComment(userId: string, commentId: number): Promise<void>;
}