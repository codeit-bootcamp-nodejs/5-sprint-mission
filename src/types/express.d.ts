import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email?: string;
        nickname?: string;
      };
    }
  }
}

export {};
