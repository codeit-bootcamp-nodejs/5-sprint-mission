import { BaseRepo } from "./base.repo.js";
import { ArticleMapper } from "./mapper/article.mapper.js";
import { CommentMapper } from "./mapper/comment.mapper.js";
import { ProductMapper } from "./mapper/product.mapper.js";

export class CommentRepo extends BaseRepo {
  constructor(prisma) {
    super(prisma);
  }
  findProductById = async (id) => {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };
  findArticleById = async (id) => {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    return article ? ArticleMapper.toEntity(article) : null;
  };

  findCommentById = async (id) => {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    return comment ? CommentMapper.toEntity(comment) : null;
  };

  findCommentList = async ({ cursor, limit, orderBy }) => {
    const commentList = await this.prisma.comment.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [orderBy],
    });

    return commentList.map((comment) => CommentMapper.toEntity(comment));
  };

  create = async ({ targetType, entity }) => {
    const comment = await this.prisma.comment.create({
      data: {
        ...CommentMapper.toPersistent(entity),
        product:
          targetType === "product"
            ? { connect: { id: entity.targetId } }
            : undefined,
        article:
          targetType === "article"
            ? { connect: { id: entity.targetId } }
            : undefined,
      },
      include: targetType === "product" ? { product: true } : { article: true },
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
