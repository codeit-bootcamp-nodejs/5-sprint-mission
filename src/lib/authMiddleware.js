import { verifyToken } from './jwt.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: '인증 토큰이 필요합니다.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
  }
}
