interface UserPayload {
  id: number;
  email: string;
  nickname: string;
  password?: string;
}

declare namespace Express {
  export interface Request {
    user?: UserPayload | null;
  }
}
