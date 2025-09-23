export class CreateCommentResDto {
  constructor(createComment) {
    this.id = createComment.id;
    this.content = createComment.content;
    this.createdAt = createComment.createdAt;
    this.updatedAt = createComment.updatedAt;
  }
}
