import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../Repository/user.repository";
import { SignupDto, SigninDto, UserResponse } from "../dto/user.dto";
import { TokenResponse, UserPayload } from "../dto/auth.dto";

export class UserService {
  private repo = new UserRepository();

  async signup(dto: SignupDto): Promise<UserResponse> {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.repo.create({ ...dto, password: hashed });
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      image: user.image,
    };
  }

  async signin(dto: SigninDto): Promise<TokenResponse> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email } as UserPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id } as UserPayload,
      process.env.REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET as string
      ) as UserPayload;
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );
      return { accessToken };
    } catch {
      throw new Error("Refresh Token이 유효하지 않습니다.");
    }
  }

  async getMe(userId: number): Promise<UserResponse | null> {
    const user = await this.repo.findById(userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
      image: user.image,
    };
  }

  async updateProfile(userId: number, data: Partial<UserResponse>) {
    return this.repo.updateProfile(userId, data);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new Error("기존 비밀번호가 올바르지 않습니다.");

    const hashed = await bcrypt.hash(newPassword, 10);
    return this.repo.updateProfile(userId, { password: hashed });
  }
}
