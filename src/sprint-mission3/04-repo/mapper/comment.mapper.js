import { Comment } from "../../03-domain/entity/comment.js";

export class CommentMapper {
  static toEntity(record) {
    return new Comment({
      id: record.id,
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  static toPersistent(entity) {
    return {
      content: entity.content,
    };
  }
}
