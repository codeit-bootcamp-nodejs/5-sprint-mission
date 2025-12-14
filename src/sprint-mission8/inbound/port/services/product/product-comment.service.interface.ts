import { PersitstProductCommentEntity } from "../../../../domain/entity/comment/product-comment.entity";
import { CreateProductCommentDto, DeleteProductCommentDto, GetProductCommentDto, UpdateProductCommentDto } from "../../../requests/product/product.req.schemas";

export interface IProductCommentService {
  getCommentList(dto: GetProductCommentDto): Promise<PersitstProductCommentEntity[]>;
  createComment(dto: CreateProductCommentDto): Promise<PersitstProductCommentEntity>;
  updateComment(dto: UpdateProductCommentDto): Promise<PersitstProductCommentEntity>;
  deleteComment(dto:DeleteProductCommentDto): Promise<void>;
}