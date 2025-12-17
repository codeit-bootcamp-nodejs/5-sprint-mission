import { AuthMiddleware } from "./middlewares/auth.middleware";

export class Middlewares {
  constructor(
    public readonly auth: AuthMiddleware
  ){}
}