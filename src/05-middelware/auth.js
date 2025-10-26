import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "토큰 필요" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ message: "유효하지 않은 토큰" });
  }
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" });
  return { accessToken, refreshToken };
};

export const refreshAccessToken = (refreshToken, prisma) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const tokens = generateTokens(decoded.userId);
    prisma.user.update({ where: { id: decoded.userId }, data: { refreshToken: tokens.refreshToken } });
    return tokens;
  } catch {
    throw new Error("Refresh Token 유효하지 않음");
  }
};
