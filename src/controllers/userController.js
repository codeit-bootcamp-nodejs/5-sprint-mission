import { prismaClient } from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import { signToken, signRefreshToken, verifyToken } from '../lib/jwt.js';

export async function registerUser(req, res) {
  const { email, nickname, password } = req.body;
  if (!email || !nickname || !password) {
    return res.status(400).send({ message: 'email, nickname, password는 필수입니다.' });
  }

  // 이메일 중복 체크
  const existingUser = await prismaClient.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).send({ message: '이미 가입된 이메일입니다.' });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 회원 생성
  const user = await prismaClient.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });

  // 비밀번호는 응답에서 제외
  const { password: _, ...userData } = user;
  return res.status(201).send(userData);
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'email, password는 필수입니다.' });
  }

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).send({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).send({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  // 토큰 발급
  const token = signToken({ userId: user.id, email: user.email, nickname: user.nickname });
  const refreshToken = signRefreshToken({ userId: user.id });
  await prismaClient.user.update({ where: { id: user.id }, data: { refreshToken } });
  return res.send({ accessToken: token, refreshToken });
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send({ message: 'Refresh Token이 필요합니다.' });
  }
  let payload;
  try {
    payload = verifyToken(refreshToken);
  } catch (e) {
    return res.status(401).send({ message: '유효하지 않은 Refresh Token입니다.' });
  }
  const user = await prismaClient.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).send({ message: 'Refresh Token이 일치하지 않습니다.' });
  }
  const newAccessToken = signToken({ userId: user.id, email: user.email, nickname: user.nickname });
  return res.send({ accessToken: newAccessToken });
}
