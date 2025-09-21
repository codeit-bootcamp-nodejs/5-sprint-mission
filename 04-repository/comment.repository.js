import { Comment } from "../03-domain/entity/comment.js";
import { BaseRepository } from "./base.repository.js"



export class CommentRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma)
    }

    async findAll(params, query) {
        const { offset = 0, limit = 10, search = "", sort = "desc" } = query;

        const productId = params.productId;

        const comments = await this.prisma.comment.findMany({
            where: { productId },
            skip: parseInt(offset),
            take: parseInt(limit),
            orderBy: {
                createdAt: sort,
            },
        });

        const commentEntities = comments.map((comment) => {
            return Comment.forCreate(comment);
        });

        return commentEntities;
    }

    async save(entity) {
        const comment = await this.prisma.comment.create({
            data: {
                id: entity.id,
                content: entity.content,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                articleId: entity.articleId,
                productId: entity.productId
            }
        });

        return Comment.forCreate(comment);
    }

    async updateById(entity) {
        const id = entity.id;

        const comment = await this.prisma.comment.update({

            where: { id },
            data: {
                id: id,
                content: entity.content,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                articleId: entity.articleId,
                productId: entity.productId
            }
        });

        return Comment.forCreate(comment);
    }

    async deleteById(id) {
        await this.prisma.comment.delete({
            where: {
                id: id
            },
        });
    }
}