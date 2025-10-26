// services/user-service.js
import { UserRepository } from "../repositories/user-repository.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

export class UserService {
  constructor(prisma) {
    this.userRepository = new UserRepository(prisma);
  }

  async getMyInfo(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다");
    return user;
  }

  async updateMyInfo(userId, updateData) {
    const { password, email, id, createdAt, updatedAt, ...allowedData } =
      updateData;
    if (Object.keys(allowedData).length === 0) {
      throw new Error("수정할 정보가 없습니다");
    }
    const updatedUser = await this.userRepository.update(userId, allowedData);
    return updatedUser;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await this.userRepository.findUserByEmail(
      (await this.userRepository.findById(userId)).email,
    );
    if (!user) throw new Error("사용자를 찾을 수 없습니다");

    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid)
      throw new Error("현재 비밀번호가 일치하지 않습니다");

    if (await comparePassword(newPassword, user.password)) {
      throw new Error("새 비밀번호는 현재 비밀번호와 달라야 합니다");
    }

    const hashedNewPassword = await hashPassword(newPassword);
    return await this.userRepository.updatePassword(userId, hashedNewPassword);
  }

  async getMyProducts(userId, query = {}) {
    return await this.userRepository.findUserProducts(userId, query);
  }
}
