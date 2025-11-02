export type SignupDTO = { email: string; nickname: string; password: string };
export type LoginDTO = { email: string; password: string };

export type UpdateMeDTO = { nickname?: string; image?: string | null };
export type ChangePasswordDTO = {
  currentPassword: string;
  newPassword: string;
};

export type CreateProductDTO = {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string | null;
};
export type UpdateProductDTO = Partial<CreateProductDTO>;

export type CreateArticleDTO = { title: string; content: string };
export type UpdateArticleDTO = Partial<CreateArticleDTO>;

export type CreateCommentDTO = { content: string };
export type UpdateCommentDTO = { content: string };

export type WithIsLiked<T> = T & { isLiked: boolean };
