import z from "zod";

export type SignInDto = z.infer<typeof signInReqSchema>;
export type SignUpDto= z.infer<typeof signUpReqSchema>;
export type UpdatePasswordDto= z.infer<typeof updatePasswordReqSchema>;
export type UpdateDto= z.infer<typeof updateReqSchema>;
export type UserLikeListDto= z.infer<typeof userLikeListReqSchema>;
export type UserProductsDto= z.infer<typeof userProductsReqSchema>;
export type UserIdDto= z.infer<typeof userIdReqSchema>;
export type RefreshTokensDto= z.infer<typeof refreshTokensReqSchema>;

export const signInReqSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "비밀번호는 최소 8자 입니다.")
});

export const signUpReqSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "비밀번호는 최소 8자 입니다."),
  nickname: z.string(),
  image: z.string().optional(),
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
