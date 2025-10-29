import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-secret';

export function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', ...options });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

//ㅇ

export function signRefreshToken(payload, options = {}) {
  // Refresh Token은 더 긴 만료시간(예: 7일)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...options });
}
