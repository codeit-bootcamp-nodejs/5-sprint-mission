export type UUID = string;

export interface CreateArticleDTO {
  title: string;
  content: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images?: string[];
}

export interface CreateCommentDTO {
  content: string;
  productId?: string;
  articleId?: string;
}

export interface SignupDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileDTO {
  nickname?: string;
  image?: string | null;
}
