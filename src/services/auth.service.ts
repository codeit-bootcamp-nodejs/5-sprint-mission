import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { signAccess, signRefresh, verifyRefresh } from "../lib/token";

export const authService = {
  async signup(email: string, nickname: string, password: string) {
    const exists = await userRepository.findByEmail(email);
    if (exists) {
      const e: any = new Error("이미 가입된 이메일입니다.");
      e.status = 409;
      throw e;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create(email, nickname, hashed);
    return { id: user.id, email: user.email, nickname: user.nickname };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const e: any = new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      e.status = 401;
      throw e;
    }
    const full = await userRepository.findById(user.id, true);
    const ok = await bcrypt.compare(password, full!.password as string);
    if (!ok) {
      const e: any = new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      e.status = 401;
      throw e;
    }
    return {
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    };
  },

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      const e: any = new Error("refreshToken이 없습니다.");
      e.status = 401;
      throw e;
    }
    const payload = verifyRefresh(refreshToken);
    const u = await userRepository.findById(payload.userId);
    if (!u) {
      const e: any = new Error("유효하지 않은 토큰");
      e.status = 401;
      throw e;
    }
    return { accessToken: signAccess(u.id), refreshToken: signRefresh(u.id) };
  },
};
