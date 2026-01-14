import { UserProductsDto, UserLikeListDto } from "../../../inbound/requests/user/user.req.schemas";
import { BusinessExceptionType } from "../../../shared/const/business.exception.info";
import { BusinessException } from "../../../shared/exceptions/business.exception";
import { UserKeys, Sort, ProductKeys } from "../../../types/query";
import { PersistArticleEntity } from "../../command/entity/article.entity";
import { PersistProductEntity } from "../../command/entity/product/product.entity";
import { IArticleQueryRepo } from "../../port/repo/query/article.query.repo.interface";
import { IProductQueryRepo } from "../../port/repo/query/product.query.repo.interface";
import { IUserQueryRepo } from "../../port/repo/query/user.query.repo.interface";
import { ProductView } from "../views/product.view";
import { UserView } from "../views/user.view";

export class UserQueryService {
  constructor(
    private readonly _userQueryRepo: IUserQueryRepo,
    private readonly _articleQueryRepo: IArticleQueryRepo,
    private readonly _productQueryRepo: IProductQueryRepo
  ){}
  
  async getUser(id: string): Promise<UserView> {
    const foundUser = await this._userQueryRepo.findUserById(id);
    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }
    return foundUser;
  }

  async getProductsBySeller(dto: UserProductsDto): Promise<ProductView[]> {
    const orderBy: { field: ProductKeys; sort: Sort } =
      dto.sort === "recent"
        ? {
            field: "updatedAt",
            sort: "desc",
          }
        : dto.sort === "price-lowest"
          ? {
              field: "price",
              sort: "asc",
            }
          : {
              field: "price",
              sort: "desc",
            };

    if (dto.limit > 20) {
      throw new BusinessException({ type: BusinessExceptionType.LIMIT_MAX_20 });
    }

    const foundUser = await this._userQueryRepo.findUserById(dto.id);

    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }

    const foundUserProducts = await this._productQueryRepo.findProductsByOwner(
      dto.id,
      dto.offset,
      dto.limit,
      orderBy,
    );
    if (!foundUserProducts) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_PRODUCTS_NOT_EXIST,
      });
    }

    return foundUserProducts;
  }

  async getUserLikeProducts(
    dto: UserLikeListDto,
  ): Promise<ProductView[]> {
    if (dto.limit > 20) {
      throw new BusinessException({ type: BusinessExceptionType.LIMIT_MAX_20 });
    }

    const foundUser = await this._userQueryRepo.findUserById(dto.userId);
    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }

    const foundUserLikeProducts = await this._productQueryRepo.findProductsLikedByUser(
      dto.userId,
      dto.offset,
      dto.limit,
    );
    if (!foundUserLikeProducts) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_LIKEPRODUCTS_NOT_EXIST,
      });
    }

    return foundUserLikeProducts;
  }

  async getUserLikeArticles(
    dto: UserLikeListDto,
  ): Promise<PersistArticleEntity[]> {
    if (dto.limit > 20) {
      throw new BusinessException({ type: BusinessExceptionType.LIMIT_MAX_20 });
    }

    const foundUser = await this._userQueryRepo.findUserById(dto.userId);
    if (!foundUser) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_NOT_EXIST,
      });
    }

    const foundUserLikeArticles = await this._articleQueryRepo.findUserLikeArticles(
      dto.userId,
      dto.offset,
      dto.limit,
    );
    if (!foundUserLikeArticles) {
      throw new BusinessException({
        type: BusinessExceptionType.USER_LIKEARTICLES_NOT_EXIST,
      });
    }

    return foundUserLikeArticles;
  }
}