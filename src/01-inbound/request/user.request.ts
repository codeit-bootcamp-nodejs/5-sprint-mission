import z from "zod";

// User
export const userBodySchema = z.object({
  email: z.string(),
  nickname: z.string(),
  password: z.string(),
});

export type UserSignUpDto = z.infer<typeof userBodySchema>;

export type UserSignInDto = z.infer<typeof userBodySchema> & {
  nickname?: string;
  userId: string;
};
