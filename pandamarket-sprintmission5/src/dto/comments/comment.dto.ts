export type UploadCommentBaseDto = {
  userId: number;
  content: string;
};

export type UploadProductCommentDto = UploadCommentBaseDto & {
  productId: number;
};

export type UploadArticleCommentDto = UploadCommentBaseDto & {
  articleId: number;
};

export type EditCommentDto = {
  content: string;
};