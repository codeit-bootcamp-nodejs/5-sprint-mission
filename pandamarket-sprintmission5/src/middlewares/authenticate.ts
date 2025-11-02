import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function authenticate(options = { optional: false }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    try {
      if (!accessToken) {
        throw new Error("No token provided");
      }

      const { userId } = verifyAccessToken(accessToken);
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new Error("Token claims invalid user ID");
      }

      req.body.user = user;
      next();
    } catch (error) {
      if (options.optional) {
        return next();
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

export default authenticate;
