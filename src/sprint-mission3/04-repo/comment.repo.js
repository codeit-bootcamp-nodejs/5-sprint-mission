import { BaseRepo } from "./base.repo.js";
import { CommentMapper } from "./mapper/comment.mapper.js";

export class CommentRepo extends BaseRepo {
  constructor(prisma) {
    super(prisma);
  }

  findCommentById = async (id) => {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    return comment ? CommentMapper.toEntity(comment) : null;
  };

  findCommentList = async ({ cursor, limit, orderBy }) => {
    const commentList = await this.prisma.comment.findMany({
      skip: cursor,
      take: limit,
      orderBy: [orderBy],
    });

    return commentList.map((comment) => CommentMapper.toEntity(comment));
  };

  create = async (entity) => {
    const comment = await this.prisma.comment.create({
      data: {
        ...CommentMapper.toPersistent(entity),
        product:
          entity.targetType === "product"
            ? { connect: { id: entity.targetId } }
            : undefined,
        article:
          entity.targetType === "article"
            ? { connect: { id: entity.targetId } }
            : undefined,
      },
      include: {
        product: true,
        article: true,
      },
    });
    return CommentMapper.toEntity(comment);
  };

  update = async (entity) => {
    const updatedcomment = await this.prisma.comment.update({
      where: { id: entity.id },
      data: {
        ...CommentMapper.toPersistent(entity),
        updatedAt: new Date(),
      },
    });

    return CommentMapper.toEntity(updatedcomment);
  };

  delete = async (id) => {
    const deletedComment = await this.prisma.comment.delete({
      where: { id },
    });
    return deletedComment;
  };

  count = async () => {
    const totalCount = await this.prisma.comment.count();
    return totalCount;
  };
}
