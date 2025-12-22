import { UserSignUpDto, UserSignInDto, UserEditDto } from "../../../01-inbound/request/user.request";
import { ProductResDto } from "../../../01-inbound/response/product.response";
import { AuthenticatorType } from "../../../shared/authenticator/authenticator";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { UserEntity } from "../../command/entity/user.entity";
import { IProductCommandRepository } from "../../port/repositories/command/I.product.repository";
import { IUserCommandRepository } from "../../port/repositories/command/I.user.repository";
import { IUserQueryRepository } from "../../port/repositories/query/I.user.query.repository";


export const createUserQueryService = (
  userQueryRepository: IUserQueryRepository,
  auth: AuthenticatorType
) => {


  const getInfo = async (userId: string) => {
    const savedUser = await userQueryRepository.findById(userId);
    return auth.filterSensitiveUserData(savedUser);

  };


  const getUserProducts = async (userId: string) => {
    const products = await userQueryRepository.findProducts(userId);
    return auth.filterSensitiveUserData(products);
  };

  const getUserArticles = async (userId: string) => {
    const products = await userQueryRepository.findArticles(userId);
    return auth.filterSensitiveUserData(products);
  };


  const getUserComments = async (userId: string) => {
    const products = await userQueryRepository.findComments(userId);
    return auth.filterSensitiveUserData(products);
  };

  return {
    getUserArticles,
    getUserComments,
    getInfo,
    getUserProducts,
  };
};

export type UserQueryServiceType = ReturnType<typeof createUserQueryService>;
