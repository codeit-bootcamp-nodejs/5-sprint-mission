import { IRepository } from "../../outbound/repository";
import { PersistedUserEntity, UpdateUserAttrs } from "../entity/user-entity";
import { BaseService } from "./base-service";
import { comparePassword, hashPassword } from "../../shared/bcrypt";
import BadRequestError from "../../shared/errors/BadRequestError";
import NotFoundError from "../../shared/errors/NotFoundError";
import { IUserService } from "../port/service/user-service";

export class UserService extends BaseService implements IUserService {
  constructor(repository: IRepository) {
    super(repository);
  }

  async getMyInfo(userId: number) {
    const user = await this.repository.user.findById(userId);

    return user;
  }

  async updateMyInfo(userId: number, updateData: UpdateUserAttrs) {
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("수정할 정보가 없습니다");
    }
    const updatedUser = await this.repository.user.update(userId, updateData);
    if (!updatedUser) {
      throw new BadRequestError("사용자 정보를 업데이트하는 데 실패했습니다.");
    }
    return updatedUser;
  }

  async changeMyPassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.repository.base.findUserById(userId);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다", userId);
    }

    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.hasedPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestError("현재 비밀번호가 일치하지 않습니다");
    }
    const hashedNewPassword = await hashPassword(newPassword);

    return await this.repository.user.updatePassword(userId, hashedNewPassword);
  }
}
