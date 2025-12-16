import { Comment } from "../entities/comment.entity";
import { ID } from "../../common/types/common";

export interface ICommentRepository {
  create(data: {
    content: string;
    userId: ID;
    articleId?: ID | null;
    productId?: ID | null;
  }): Promise<Comment>;

  findById(id: ID): Promise<Comment | null>;

  findByArticleId(
    articleId: ID,
    query: {
      cursor?: ID;
      limit: number;
    },
  ): Promise<{ items: Comment[]; nextCursor: ID | null }>;

  findByProductId(
    productId: ID,
    query: {
      cursor?: ID;
      limit: number;
    },
  ): Promise<{ items: Comment[]; nextCursor: ID | null }>;

  update(
    id: ID,
    data: {
      content: string;
    },
  ): Promise<Comment>;

  delete(id: ID): Promise<void>;
  countByUserId(userId: ID): Promise<number>;
}
