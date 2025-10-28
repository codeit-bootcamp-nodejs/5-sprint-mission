import { RequestHandler } from "express";

const t = (s: unknown) => (typeof s === "string" ? s.trim() : s);

const toTags = (v: unknown): string[] => {
  if (v == null) return [];
  if (Array.isArray(v))
    return (v as unknown[]).map(t).filter(Boolean) as string[];
  if (typeof v === "string")
    return (v as string)
      .split(",")
      .map((x) => String(t(x)))
      .filter(Boolean);
  return [];
};

export const validateSignup: RequestHandler = (req, res, next) => {
  const { email, nickname, password } = (req.body ?? {}) as any;
  if (!email || !nickname || !password)
    return res
      .status(400)
      .json({ message: "email, nickname, password는 필수입니다." });
  if (typeof email !== "string" || !email.includes("@"))
    return res.status(400).json({ message: "올바른 이메일 형식이 아닙니다." });
  if (
    typeof nickname !== "string" ||
    (t(nickname) as string).length < 2 ||
    (t(nickname) as string).length > 30
  )
    return res.status(400).json({ message: "닉네임은 2~30자입니다." });
  if (typeof password !== "string" || password.length < 6)
    return res
      .status(400)
      .json({ message: "비밀번호는 최소 6자 이상이어야 합니다." });

  req.validated = { email: t(email), nickname: t(nickname), password };
  next();
};

export const validateLogin: RequestHandler = (req, res, next) => {
  const { email, password } = (req.body ?? {}) as any;

  if (!email || !password)
    return res.status(400).json({ message: "email, password는 필수입니다." });
  if (typeof email !== "string" || !email.includes("@"))
    return res.status(400).json({ message: "올바른 이메일 형식이 아닙니다." });

  req.validated = { email: t(email), password };
  next();
};

export const validateCreateProduct: RequestHandler = (req, res, next) => {
  const { name, description, price, tags, imageUrl } = (req.body ?? {}) as any;

  if (!name || !description || price == null)
    return res
      .status(400)
      .json({ message: "name, description, price는 필수입니다." });
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0)
    return res
      .status(400)
      .json({ message: "price는 0 이상의 숫자여야 합니다." });

  req.validated = {
    name: t(name),
    description: t(description),
    price,
    tags: toTags(tags),
    imageUrl: imageUrl ?? null,
  };
  next();
};

export const validateUpdateProduct: RequestHandler = (req, res, next) => {
  const { name, description, price, tags, imageUrl } = (req.body ?? {}) as any;

  if (name === "" || description === "" || price === "")
    return res.status(400).json({ message: "빈 문자열은 허용되지 않습니다." });

  if (
    price != null &&
    (typeof price !== "number" || !Number.isFinite(price) || price < 0)
  )
    return res
      .status(400)
      .json({ message: "price는 0 이상의 숫자여야 합니다." });

  const out: any = {};
  if (name != null) out.name = String(t(name));
  if (description != null) out.description = String(t(description));
  if (price != null) out.price = price;
  if (tags != null) out.tags = toTags(tags);
  if (imageUrl !== undefined) out.imageUrl = imageUrl ?? null;

  req.validated = out;
  next();
};

export const validateCreateArticle: RequestHandler = (req, res, next) => {
  const { title, content, tags } = (req.body ?? {}) as any;

  if (!title || !content)
    return res.status(400).json({ message: "title, content 필수입니다." });

  req.validated = { title: t(title), content: t(content), tags: toTags(tags) };
  next();
};

export const validateUpdateArticle: RequestHandler = (req, res, next) => {
  const { title, content, tags } = (req.body ?? {}) as any;

  if (title === "" || content === "")
    return res.status(400).json({ message: "빈 문자열은 허용되지 않습니다." });

  const out: any = {};
  if (title != null) out.title = String(t(title));
  if (content != null) out.content = String(t(content));
  if (tags != null) out.tags = toTags(tags);

  req.validated = out;
  next();
};

const MAX_COMMENT_LEN = 500;

export const validateCreateComment: RequestHandler = (req, res, next) => {
  const { content } = (req.body ?? {}) as any;
  const v = t(content);

  if (!v) return res.status(400).json({ message: "content는 필수입니다." });
  if (String(v).length > MAX_COMMENT_LEN)
    return res
      .status(400)
      .json({ message: `댓글은 ${MAX_COMMENT_LEN}자 이하여야 합니다.` });

  req.validated = { content: v };
  next();
};

export const validateUpdateComment: RequestHandler = (req, res, next) => {
  const { content } = (req.body ?? {}) as any;
  const v = t(content);

  if (!v)
    return res.status(400).json({ message: "댓글 내용은 비워둘 수 없습니다." });
  if (String(v).length > MAX_COMMENT_LEN)
    return res
      .status(400)
      .json({ message: `댓글은 ${MAX_COMMENT_LEN}자 이하여야 합니다.` });

  req.validated = { content: v };
  next();
};
