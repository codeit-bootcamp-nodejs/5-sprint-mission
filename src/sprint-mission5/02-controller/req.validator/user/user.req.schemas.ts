import z from "zod";

export const signInReqSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "비밀번호는 최소 8자 입니다.")
});

export const signUpReqSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "비밀번호는 최소 8자 입니다."),
  nickname: z.string(),
  image: z.string(),
});

export const updatePasswordReqSchema = z.object({
  userId: z.string(),
  password: z.string(),
  updatePassword: z.string().min(8, "비밀번호는 최소 8자 입니다.")
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const updateReqSchema = z.object({
  userId: z.string(),
  email: z.email().optional(),
  nickname: z.string().optional(),
  image: z.string().optional(),
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const userLikeListReqSchema = z.object({
  userId: z.string(),
  offset: z.number().default(0),
  limit: z.number().default(5),
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const userProductsReqSchema = z.object({
  userId: z.string(),
  offset: z.number().default(0),
  limit: z.number().default(5),
  sort: z.enum(["recent", "email-asc", "email-desc"]).default("recent"),
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const userIdReqSchema = z.object({
  userId: z.string()
});

export const refreshTokensReqSchema = z.object({
  refreshToken: z.string()
});
