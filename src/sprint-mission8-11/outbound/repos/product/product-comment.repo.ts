import {
  NewProductCommentEntity,
  PersitstProductCommentEntity,
} from "../../../domain/entity/comment/product-comment.entity";
import { IProductCommentRepo } from "../../../domain/port/repo/product/product-comment.repo.interface";
import { CommentKeys, Sort } from "../../../types/query";
import { ProductCommentMapper } from "../../mapper/comment/product.comment.mapper";
import { BaseRepo } from "../base.repo";

export class ProductCommentRepo
  extends BaseRepo
  implements IProductCommentRepo
{
  async findCommentById(
    id: number,
  ): Promise<PersitstProductCommentEntity | null> {
    const productComment = await this._prisma.productComment.findUnique({
      where: { id },
    });
    return productComment
      ? ProductCommentMapper.toPersistEntity(productComment)
      : null;
  }

  async findCommentList(
    productId: string,
    cursor: number,
    limit: number,
    orderBy: { field: CommentKeys; sort: Sort },
  ): Promise<PersitstProductCommentEntity[] | null> {
    const commentList = await this._prisma.productComment.findMany({
      where: { productId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        [orderBy.field]: orderBy.sort,
      },
    });

    return commentList.map((comment) =>
      ProductCommentMapper.toPersistEntity(comment),
    );
  }

  async create(
    entity: NewProductCommentEntity,
  ): Promise<PersitstProductCommentEntity> {
    const comment = await this._prisma.productComment.create({
      data: {
        ...ProductCommentMapper.toCreateData(entity),
      },
    });

    return ProductCommentMapper.toPersistEntity(comment);
  }

  async update(
    entity: PersitstProductCommentEntity,
  ): Promise<PersitstProductCommentEntity> {
    const updatedcomment = await this._prisma.productComment.update({
      where: {
        id: entity.id,
      },
      data: {
        ...ProductCommentMapper.toUpdateData(entity),
        updatedAt: new Date(),
      },
    });

    return ProductCommentMapper.toPersistEntity(updatedcomment);
  }

  async delete(commentId: number): Promise<void> {
    await this._prisma.productComment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async count(productId: string): Promise<number> {
    return await this._prisma.productComment.count({
      where: { productId },
    });
  }
}
