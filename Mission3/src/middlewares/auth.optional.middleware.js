import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;

export default async function authOptionalMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
      req.user = null;
      return next();
    }

    const token = tokenParts[1];
    let payload;

    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (e) {
      req.user = null;
      return next();
    }

    const userId = payload.id;
    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });

    req.user = user || null;

    next();
  } catch (error) {
    next(error);
  }
}
