import { UserRepository } from "../repo/user.repository";
import { HttpError } from "../middlewares/error.handler";
import { UpdateMeDto, ChangePasswordDto } from "../dto/user.dto";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findUserById(userId);
    if (user) {
      const { password, refreshToken, ...resData } = user;
      return resData;
    }
    return null;
  }

  async updateMe(userId: number, data: UpdateMeDto) {
    if (data.nickname) {
      const existingUser = await this.userRepository.findUserByNickname(
        data.nickname,
      );
      if (existingUser && existingUser.id !== userId) {
        throw new HttpError(409, "이미 사용중인 닉네임입니다.");
      }
    }
    return this.userRepository.updateMe(userId, data);
  }

  async changePassword(userId: number, data: ChangePasswordDto) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new HttpError(404, "유저를 찾을 수 없습니다.");
    }

    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpError(401, "현재 비밀번호가 올바르지 않습니다.");
    }

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.updateUserPassword(userId, hashedNewPassword);
  }

  async getMyProducts(userId: number) {
    return this.userRepository.findUserProducts(userId);
  }

  async getLikedProducts(userId: number) {
    return this.userRepository.findUserLikedProducts(userId);
  }
}
