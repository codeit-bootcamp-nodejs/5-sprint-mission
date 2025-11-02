import "express";

declare module "express-serve-static-core" {
  interface Request {
    validated?: unknown;
    user?: {
      id: number;
      email: string;
      nickname: string;
      password?: string;
      image?: string | null;
      createdAt?: Date;
    };
  }
}
