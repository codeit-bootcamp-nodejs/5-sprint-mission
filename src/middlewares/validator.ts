import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  SignupDTO, LoginDTO,
  CreateProductDTO, UpdateProductDTO,
  CreateArticleDTO, UpdateArticleDTO,
  CreateCommentDTO, UpdateCommentDTO,
} from "../types/dto";

const isObj = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";
const trim = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const toTags = (v: unknown): string[] => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(x => (typeof x === "string" ? x.trim() : "")).filter(Boolean) as string[];
  if (typeof v === "string") return v.split(",").map(x => x.trim()).filter(Boolean);
  return [];
};
const badReq = (res: Response, message: string) => res.status(400).json({ message });

export const validateSignup: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const email = b.email, nickname = b.nickname, password = b.password;
  if (!email || !nickname || !password) return badReq(res, "email, nickname, password는 필수입니다.");
  if (typeof email !== "string" || !email.includes("@")) return badReq(res, "올바른 이메일 형식이 아닙니다.");
  const nick = trim(nickname);
  if (nick.length < 2 || nick.length > 30) return badReq(res, "닉네임은 2~30자입니다.");
  if (typeof password !== "string" || password.length < 6) return badReq(res, "비밀번호는 최소 6자 이상이어야 합니다.");
  (req as unknown as { validated: SignupDTO }).validated = { email: email.trim(), nickname: nick, password };
  next();
};
export const validateLogin: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const email = b.email, password = b.password;
  if (!email || !password) return badReq(res, "email, password는 필수입니다.");
  if (typeof email !== "string" || !email.includes("@")) return badReq(res, "올바른 이메일 형식이 아닙니다.");
  (req as unknown as { validated: LoginDTO }).validated = { email: String(email).trim(), password: String(password) };
  next();
};

export const validateCreateProduct: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const { name, description, price, tags, imageUrl } = b as Record<string, unknown>;
  if (!name || !description || price == null) return badReq(res, "name, description, price는 필수입니다.");
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) return badReq(res, "price는 0 이상의 숫자여야 합니다.");
  (req as unknown as { validated: CreateProductDTO }).validated = {
    name: trim(name), description: trim(description), price, tags: toTags(tags),
    imageUrl: imageUrl === undefined ? undefined : imageUrl === null ? null : String(imageUrl),
  };
  next();
};
export const validateUpdateProduct: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const { name, description, price, tags, imageUrl } = b as Record<string, unknown>;
  if (name === "" || description === "" || price === "") return badReq(res, "빈 문자열은 허용되지 않습니다.");
  if (price != null && (typeof price !== "number" || !Number.isFinite(price) || price < 0))
    return badReq(res, "price는 0 이상의 숫자여야 합니다.");
  const out: UpdateProductDTO = {};
  if (name != null) out.name = trim(name);
  if (description != null) out.description = trim(description);
  if (typeof price === "number") out.price = price;
  if (tags != null) out.tags = toTags(tags);
  if (imageUrl !== undefined) out.imageUrl = imageUrl === null ? null : String(imageUrl);
  (req as unknown as { validated: UpdateProductDTO }).validated = out;
  next();
};

export const validateCreateArticle: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const title = b.title, content = b.content;
  if (!title || !content) return badReq(res, "title, content 필수입니다.");
  (req as unknown as { validated: CreateArticleDTO }).validated = { title: trim(title), content: trim(content) };
  next();
};
export const validateUpdateArticle: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const title = b.title, content = b.content;
  if (title === "" || content === "") return badReq(res, "빈 문자열은 허용되지 않습니다.");
  const out: UpdateArticleDTO = {};
  if (title != null) out.title = trim(title);
  if (content != null) out.content = trim(content);
  (req as unknown as { validated: UpdateArticleDTO }).validated = out;
  next();
};

const MAX_COMMENT_LEN = 500;
export const validateCreateComment: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const v = trim(b.content);
  if (!v) return badReq(res, "content는 필수입니다.");
  if (v.length > MAX_COMMENT_LEN) return badReq(res, `댓글은 ${MAX_COMMENT_LEN}자 이하여야 합니다.`);
  (req as unknown as { validated: CreateCommentDTO }).validated = { content: v };
  next();
};
export const validateUpdateComment: RequestHandler = (req, res, next) => {
  const b = isObj(req.body) ? req.body : {};
  const v = trim(b.content);
  if (!v) return badReq(res, "댓글 내용은 비워둘 수 없습니다.");
  if (v.length > MAX_COMMENT_LEN) return badReq(res, `댓글은 ${MAX_COMMENT_LEN}자 이하여야 합니다.`);
  (req as unknown as { validated: UpdateCommentDTO }).validated = { content: v };
  next();
};

export const asValidated =
  <T>() => (req: Request, _res: Response, next: NextFunction) => {
    (req as unknown as { validated: T }).validated = req.body as T;
    next();
  };
export const requireKeys =
  (keys: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    const b = isObj(req.body) ? req.body : {};
    for (const k of keys) if (b[k] === undefined) throw Object.assign(new Error(`필수 필드 누락: ${k}`), { status: 400 });
    next();
  };
