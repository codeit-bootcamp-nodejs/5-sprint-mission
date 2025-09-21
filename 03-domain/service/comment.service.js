
import { CommentResDto } from "../../02-controller/res-dto/comment.res.dto.js";
import { Comment } from "../entity/comment.js";



export class CommentService {
    #repos
    constructor(repos) {
        this.#repos = repos;
    }

    async getAllComments(params, query) {
        const commentEntities = await this.#repos.commentRepo.findAll(params, query);
        const commentDtos = commentEntities.map((entity) => new CommentResDto(entity));
        return commentDtos;
    }

    async getComment(id) {
        const Entity = await this.#repos.Repo.findById(id);
        return new CommentResDto(Entity);
    }

    async createComment(dto) {
        const commentEntity = Comment.forCreate(dto);

        const createdComment = await this.#repos.commentRepo.save(commentEntity);

        return new CommentResDto(createdComment);
    }

    async updateComment(dto) {
        console.log(dto.params.commentId);
        const Entity = Comment.forCreate({
            id: dto.params.commentId,
            content: dto.content,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            articleId: dto.articleId,
            productId: dto.productId
        });

        const updatedComment = await this.#repos.commentRepo.updateById(Entity);
        return new CommentResDto(updatedComment);
    }


    async deleteComment(id) {
        await this.#repos.commentRepo.deleteById(id);
    }
}