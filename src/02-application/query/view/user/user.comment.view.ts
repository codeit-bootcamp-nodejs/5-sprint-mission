export interface UserCommentView {
  nickname: string;
  productComments: {
    content: string;
    createdAt: Date;
  }[];
  articleComments: {
    content: string;
    createdAt: Date;
  }[];
}
