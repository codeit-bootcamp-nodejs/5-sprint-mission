export type UUID = string;

export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images?: string[];
}

export interface CreateCommentDto {
  content: string;
  productId?: string;
  articleId?: string;
}

export interface SignupDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  nickname?: string;
  image?: string | null;
}
