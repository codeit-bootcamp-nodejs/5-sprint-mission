import {
  SignUpDto,
  UpdateDto,
  UpdatePasswordDto,
} from "../../../inbound/requests/user/user.req.schemas";
import { BusinessExceptionType } from "../../../shared/const/business.exception.info";
import { BusinessException } from "../../../shared/exceptions/business.exception";
import { PersistUserEntity, UserEntity } from "../entity/user.entity";
import { IHashManager } from "../../port/managers/hash.manager.interface";
import { IUserCommandRepo } from "../../port/repo/command/user.command.repo.interface";

export class UserCommandService {
  constructor(
    private readonly _userRepo: IUserCommandRepo,
    private readonly _hashManager: IHashManager,
  ) {}

  async signUpUser(dto: SignUpDto): Promise<void> {
    const foundUser = await this._userRepo.findUserByEmail(dto.email);

    if (foundUser) {
      throw new BusinessException({ type: BusinessExceptionType.USER_EXIST });
    }

    const newUser = await UserEntity.createNew({
      ...dto,
      hashManager: this._hashManager,
    });

    await this._userRepo.create(newUser);
  }


  async updateUser(dto: UpdateDto): Promise<PersistUserEntity> {
    const foundUser = await this._userRepo.findUserById(dto.id);
    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }

    foundUser.update(dto);

    const updateUser = await this._userRepo.update(foundUser);

    return updateUser;
  }

  async updatePasswordUser(dto: UpdatePasswordDto): Promise<PersistUserEntity> {
    const foundUser = await this._userRepo.findUserById(dto.id);
    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }

    if (!(await foundUser.isPasswordMatch(dto.password, this._hashManager))) {
      throw new BusinessException({
        type: BusinessExceptionType.PASSWORD_MISMATCH,
      });
    }

    await foundUser.updatePassword(dto.updatePassword, this._hashManager);

    return await this._userRepo.update(foundUser);
  }

  async deleteUser(id: string): Promise<void> {
    const foundUser = await this._userRepo.findUserById(id);
    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }

    await this._userRepo.delete(id);
  }
}
