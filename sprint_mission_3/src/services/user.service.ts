import bcrypt from "bcrypt";
import { UpdateMeDTO, ChangePasswordDTO } from "../types/dto";
import { userRepository } from "../repositories/user.repository";

export const userService = {
  async me(userId: number) {
    const u = await userRepository.findById(userId);
    if (!u)
      throw Object.assign(new Error("사용자를 찾을 수 없습니다."), {
        status: 404,
      });
    const { password, ...safe } = u as any;
    return safe;
  },

  async updateMe(userId: number, dto: UpdateMeDTO) {
    const u = await userRepository.findById(userId);
    if (!u)
      throw Object.assign(new Error("사용자를 찾을 수 없습니다."), {
        status: 404,
      });
    return userRepository.update(userId, dto);
  },

  async changePassword(userId: number, dto: ChangePasswordDTO) {
    const u = await userRepository.findWithPasswordById(userId);
    if (!u)
      throw Object.assign(new Error("사용자를 찾을 수 없습니다."), {
        status: 404,
      });

    const ok = await bcrypt.compare(dto.currentPassword, u.password);
    if (!ok)
      throw Object.assign(new Error("현재 비밀번호가 일치하지 않습니다."), {
        status: 400,
      });

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await userRepository.updatePassword(userId, hashed);
  },

  async myLikedProducts(userId: number) {
    return userRepository.likedProducts(userId);
  },
};
