import { UserSignUpDto, UserSignInDto, UserEditDto } from "../../../01-inbound/request/user.request";
import { ProductResDto } from "../../../01-inbound/response/product.response";
import { AuthenticatorType } from "../../../shared/authenticator/authenticator";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { IProductCommandRepository } from "../../port/repositories/command/I.product.repository";
import { IUserCommandRepository } from "../../port/repositories/command/I.user.repository";
import { PersistedProduct } from "../entity/product";
import { UserEntity } from "../entity/user.entity";

export const createUserCommandService = (
  userCommandRepository: IUserCommandRepository,
  productCommandRepository: IProductCommandRepository,
  auth: AuthenticatorType,
  notificationEventBuses: INotificationEventBus
) => {
  const createUser = async (dto: UserSignUpDto) => {
    const { email, nickname, password } = dto;

    // 리프레시토큰과 해시비밀번호 생성
    const refreshToken = auth.createToken({ email }, "refresh");
    const hashPassword = await auth.createHashPassword(password);

    // 유저 생성
    const newUserEntity = UserEntity.createNew({
      email,
      nickname,
      password: hashPassword,
      refreshToken,
    });
    const newUser = await userCommandRepository.save(newUserEntity);

    // 민감정보 필터링 후 반환
    return auth.filterSensitiveUserData(newUser);
  };

  const updateUser = async (dto: UserEditDto) => {
    const { email, nickname, password } = dto;

    const foundUser = await userCommandRepository.findById(dto.userId);
    if (!foundUser) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    const hashPassword = await auth.createHashPassword(password);
    const refreshToken = auth.createToken({ email }, "refresh");


    const updatedUser = UserEntity.createNew({
      email,
      nickname,
      refreshToken,
      password: hashPassword,
    });

    const userUpdated = await userCommandRepository.update(foundUser, updatedUser);
    return auth.filterSensitiveUserData(userUpdated);
  };

  const getTokens = async (dto: UserSignInDto) => {
    const { email, password } = dto;
    const savedUser = await userCommandRepository.findByEmail(email);
    if (!savedUser) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    await auth.verifyPassword(password, savedUser.password);
    const accessToken = auth.createToken(savedUser);
    const refreshToken = auth.createToken(savedUser, "refresh");
    const updatedUser = UserEntity.createNew({
      ...savedUser,
      refreshToken,
    });

    await userCommandRepository.update(savedUser, updatedUser);
    return { accessToken, refreshToken };
  };

  const updateRefreshToken = async (params: {
    email: string,
    refreshToken: string
  }) => {
    console.log(params.email, params.refreshToken);
    await userCommandRepository.updateRefreshToken(params.email, params.refreshToken);
  }

  return {
    createUser,
    updateUser,
    getTokens,
    updateRefreshToken
  };
};

export type UserCommandServiceType = ReturnType<typeof createUserCommandService>;
