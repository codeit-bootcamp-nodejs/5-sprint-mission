export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentListQueryDto {
  cursor?: number;
  limit: number;
}
