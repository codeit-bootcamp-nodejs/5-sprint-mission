import { prisma } from "../lib/prisma.js";
import { verifyAccess } from "../lib/token.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "토큰이 없습니다." });
    const token = header.split(" ")[1];
    const payload = verifyAccess(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "인증 실패", error: e.message });
  }
};
