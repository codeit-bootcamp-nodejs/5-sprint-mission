import { PrismaClient } from "@prisma/client";
import { ICommentRepository } from "../domain/port/commnet-repository-interface";
import { BaseRepository } from "./base-repository";
import { EditCommentDto, UploadArticleCommentDto, UploadProductCommentDto } from "../dto/comments/comment.dto";
import { CommentMapper } from "./mapper/comment-mapper";
import { PaginationQuery } from "./repository";


export class CommentRepository extends BaseRepository implements ICommentRepository {
  constructor(prisma: PrismaClient) {
    super(prisma); 
  }

  uploadProductComment = async (data: UploadProductCommentDto) => {
    const comment = await this.prisma.comment.create({
      data: CommentMapper.toPersistent(data),
    }); 
    return CommentMapper.toEntity(comment);
  };

  uploadArticleComment = async (data: UploadArticleCommentDto) => {
    const comment = await this.prisma.comment.create({
      data: CommentMapper.toPersistent(data),
    });
    return CommentMapper.toEntity(comment);
  };

  loadDetail = async (commentId: number) => {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    })
    
    if (!comment) return null;
    return CommentMapper.toEntity(comment);
  };

  editComment = async (commentId: number, data: EditCommentDto) => {
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: data,
    });
    return CommentMapper.toEntity(updatedComment);
  };

  deleteComment = async (commentId: number) => {
    await this.prisma.comment.delete({
      where: { id: commentId },
    });
  };

  loadProductComments = async (
    productId: number,
    query: PaginationQuery,
  ) => {
    const { offset = 0, limit = 10 } = query;

    const comments = await this.prisma.comment.findMany({
      where: { productId: productId },
      orderBy: { createdAt: "asc" },
      skip:offset,
      take:limit,
    });
    
    return comments.map(CommentMapper.toEntity);
  };

  loadArticleComments = async (
    articleId: number,
    query: PaginationQuery,
  ) => {
    const { offset = 0, limit = 10 } = query;

    const comments = await this.prisma.comment.findMany({
      where: { articleId: articleId },
      orderBy: { createdAt: "asc" },
      skip:offset,
      take:limit,
    })

    return comments.map(CommentMapper.toEntity);
  };
}
