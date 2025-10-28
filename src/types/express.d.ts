import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      nickname: string;
      password?: string;
      image?: string | null;
      createdAt?: Date;
    };
    validated?: any;
  }
}
