export type JwtPayload = { userId: number };

export type SignupDto = { email: string; nickname: string; password: string };
export type LoginDto = { email: string; password: string };

export type CreateProductDto = {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl: string | null;
};
export type UpdateProductDto = Partial<CreateProductDto>;

export type CreateArticleDto = {
  title: string;
  content: string;
  tags: string[];
};
export type UpdateArticleDto = Partial<CreateArticleDto>;

export type CreateCommentDto = { content: string };
export type UpdateCommentDto = CreateCommentDto;
