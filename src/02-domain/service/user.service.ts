import { UserSignUpDto, UserSignInDto, UserEditDto } from "../../01-inbound/request/user.request";
import { ProductResDto } from "../../01-inbound/response/product.response";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { INotificationEventBus } from "../../shared/eventbus/ports/I.notification.eventbus";
import { PersistedProduct } from "../entity/product";
import { UserEntity } from "../entity/user.entity";
import { IProductRepository } from "../port/repositories/I.product.repository";
import { IUserRepository } from "../port/repositories/I.user.repository";

export const createUserService = (
  userRepository: IUserRepository,
  productRepository: IProductRepository,
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
    const newUser = await userRepository.save(newUserEntity);

    // 민감정보 필터링 후 반환
    return auth.filterSensitiveUserData(newUser);
  };

  const getTokens = async (dto: UserSignInDto) => {
    const { email, password } = dto;
    const savedUser = await userRepository.findByEmail(email);
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

    await userRepository.update(savedUser, updatedUser);
    return { accessToken, refreshToken };
  };

  const getInfo = async (userId: string) => {
    const savedUser = await userRepository.findById(userId);
    return auth.filterSensitiveUserData(savedUser);
  };

  const updateUser = async (dto: UserEditDto) => {
    const { email, nickname, password } = dto;

    const foundUser = await userRepository.findById(dto.userId);
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

    const userUpdated = await userRepository.update(foundUser, updatedUser);
    return auth.filterSensitiveUserData(userUpdated);
  };

  const getUserProducts = async (userId: string) => {
    const productEntities = await productRepository.findByUserId(userId);
    return productEntities.map((entity: PersistedProduct) =>
      ProductResDto(entity),
    );
  };

  return {
    createUser,
    getTokens,
    getInfo,
    updateUser,
    getUserProducts,
  };
};

export type UserServiceType = ReturnType<typeof createUserService>;
