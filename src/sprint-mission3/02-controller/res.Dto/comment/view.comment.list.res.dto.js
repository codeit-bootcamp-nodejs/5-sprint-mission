export class ViewCommentListResDto {
  constructor(CommentList) {
    this.CommentList = CommentList.map((Comment) => ({
      id: Comment.id,
      content: Comment.content,
      createdAt: Comment.createdAt,
      updatedAt: Comment.updatedAt,
    }));
  }
}
