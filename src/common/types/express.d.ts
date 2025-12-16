import { User } from "./common";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
