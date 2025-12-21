import z from "zod";

// User
export const signUpBodySchema = z.object({
  email: z.string(),
  nickname: z.string(),
  password: z.string(),
});


export const signInBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});



export type UserSignUpDto = z.infer<typeof signUpBodySchema>;
export type UserSignInDto = z.infer<typeof signInBodySchema>;
export type UserEditDto = z.infer<typeof signUpBodySchema> & {
  userId: string
}
