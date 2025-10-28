import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";

export const userService = {
  me: (userId: number) => userRepository.findById(userId),

  update: (userId: number, nickname?: string, image?: string | null) =>
    userRepository.update(userId, { nickname, image }),

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const u = await userRepository.findById(userId, true);
    if (!u) {
      const e: any = new Error("유저를 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    const ok = await bcrypt.compare(currentPassword, u.password as string);
    if (!ok) {
      const e: any = new Error("현재 비밀번호가 일치하지 않습니다.");
      e.status = 400;
      throw e;
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(userId, hashed);
    return { message: "비밀번호 변경 완료" };
  },

  likedProducts: async (userId: number) => {
    const liked = await userRepository.likedProducts(userId);
    return liked.map((l) => l.product);
  },
};
