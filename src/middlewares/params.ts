import { Request, Response, NextFunction, RequestHandler } from "express";

export const parseIdParam =
  (param: string = "id"): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const raw = (req.params as Record<string, string | undefined>)[param];

    if (!raw) {
      return res.status(400).json({ message: `${param}는 1 이상의 정수여야 합니다.` });
    }

    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1) {
      return res
        .status(400)
        .json({ message: `${param}는 1 이상의 정수여야 합니다.` });
    }

    (req.params as unknown as Record<string, number>)[param] = n;

    next();
  };
