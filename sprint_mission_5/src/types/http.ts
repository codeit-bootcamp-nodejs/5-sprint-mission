import { Request } from "express";

export type UserJwt = { id: number; email: string; nickname: string };

export type AuthedRequest = Request & { user: UserJwt };

export type Validated<T> = Request & { validated: T };
