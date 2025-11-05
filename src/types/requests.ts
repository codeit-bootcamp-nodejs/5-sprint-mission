import { Request } from "express";
import {
  ArticleCreateData,
  ArticleUpdateData,
  ProductCreateData,
  ProductUpdateData,
  CommentCreateData,
  CommentUpdateData,
} from "./models";

export interface IdParams {
  id: string;
  [key: string]: string;
}


export interface CreateArticleRequest extends Request {
  body: ArticleCreateData;
}

export interface UpdateArticleRequest extends Request {
  body: ArticleUpdateData;
  params: IdParams;
}

export interface GetArticleRequest extends Request {
  params: IdParams;
}


export interface CreateProductRequest extends Request {
  body: ProductCreateData;
}

export interface UpdateProductRequest extends Request {
  body: ProductUpdateData;
  params: IdParams;
}

export interface GetProductRequest extends Request {
  params: IdParams;
}

export interface CreateCommentRequest extends Request {
  body: CommentCreateData;
  params: IdParams;
}

export interface UpdateCommentRequest extends Request {
  body: CommentUpdateData;
  params: IdParams;
}


export interface LikeRequest extends Request {
  params: IdParams;
}

export interface RegisterRequest extends Request {
  body: {
    email: string;
    nickname: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface RefreshTokenRequest extends Request {
  body: {
    refreshToken: string;
  };
}

export interface UpdateUserInfoRequest extends Request {
  body: {
    nickname?: string;
    image?: string;
  };
}

export interface ChangePasswordRequest extends Request {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}
