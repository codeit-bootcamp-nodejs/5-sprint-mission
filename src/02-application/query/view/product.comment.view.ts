export interface ProductCommentView {
  id: string;
  productName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    nickname: string;
  };
}
