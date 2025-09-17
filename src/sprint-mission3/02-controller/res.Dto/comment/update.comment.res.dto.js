export class UpdateCommentResDto {
  constructor(updateComment) {
    this.id = updateComment.id;
    this.content = updateComment.content;
    this.createdAt = updateComment.createdAt;
    this.updatedAt = updateComment.updatedAt;
  }
}
