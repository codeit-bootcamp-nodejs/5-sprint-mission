import bcrypt from "bcrypt";
import { SignupDTO, LoginDTO } from "../types/dto";
import { userRepository } from "../repositories/user.repository";
import { signAccess, signRefresh, verifyRefresh } from "../lib/token";

export const authService = {
  async signup(dto: SignupDTO) {
    const email = dto.email.trim().toLowerCase();
    const exists = await userRepository.findByEmail(email);
    if (exists)
      throw Object.assign(new Error("이미 가입된 이메일입니다."), {
        status: 409,
      });

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await userRepository.create({
      email,
      nickname: dto.nickname,
      password: hashed,
    });

    const { password, ...safe } = created as any;
    return safe;
  },

  async login(dto: LoginDTO) {
    const email = dto.email.trim().toLowerCase();
    const u = await userRepository.findWithPasswordByEmail(email);
    if (!u)
      throw Object.assign(new Error("잘못된 이메일 또는 비밀번호입니다."), {
        status: 401,
      });

    const ok = await bcrypt.compare(dto.password, u.password);
    if (!ok)
      throw Object.assign(new Error("잘못된 이메일 또는 비밀번호입니다."), {
        status: 401,
      });

    const accessToken = signAccess({
      sub: u.id,
      email: u.email,
      nickname: u.nickname,
    });
    const refreshToken = signRefresh({ sub: u.id });
    return { accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    if (!refreshToken)
      throw Object.assign(new Error("리프레시 토큰이 필요합니다."), {
        status: 400,
      });

    const payload = verifyRefresh(refreshToken);
    const user = await userRepository.findById(payload.sub);
    if (!user)
      throw Object.assign(new Error("사용자를 찾을 수 없습니다."), {
        status: 404,
      });

    const accessToken = signAccess({
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    });
    return accessToken;
  },
};
