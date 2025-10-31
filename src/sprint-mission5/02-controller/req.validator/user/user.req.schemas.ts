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
  password: z.string().min(8, "수정할 비밀번호는 최소 8자 입니다."),
  updatePassword: z.string().min(8, "비밀번호는 최소 8자 입니다.")
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const updateReqSchema = z.object({
  userId: z.string(),
  email: z.email(),
  nickname: z.string(),
  image: z.string(),
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const userLikeListReqSchema = z.object({
  userId: z.string(),
  offset: z.number(),
  limit: z.number(),
}).transform((data) => ({
  ...data,
  id: data.userId,
}));

export const userProductsReqSchema = z.object({
  userId: z.string(),
  offset: z.number(),
  limit: z.number(),
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
