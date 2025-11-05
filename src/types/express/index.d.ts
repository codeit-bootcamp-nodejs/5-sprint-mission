import { UserPayload } from "../../dto/auth.dto";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};