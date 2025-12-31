import { PersistArticleEntity } from "../../../domain/entity/article.entity";
import { PersistProductEntity } from "../../../domain/entity/product/product.entity";
import { PersistUserEntity } from "../../../domain/entity/user.entity";
import {
  SignUpDto,
  UpdateDto,
  UpdatePasswordDto,
  UserLikeListDto,
  UserProductsDto,
} from "../../requests/user/user.req.schemas";

export interface IUserService {
  signUpUser(dto: SignUpDto): Promise<PersistUserEntity>;

  getUser(id: string): Promise<PersistUserEntity>;

  getUserProducts(dto: UserProductsDto): Promise<PersistProductEntity[]>;

  getUserLikeProducts(dto: UserLikeListDto): Promise<PersistProductEntity[]>;

  getUserLikeArticles(dto: UserLikeListDto): Promise<PersistArticleEntity[]>;

  updateUser(dto: UpdateDto): Promise<PersistUserEntity>;

  updatePasswordUser(dto: UpdatePasswordDto): Promise<PersistUserEntity>;

  deleteUser(id: string): Promise<void>;
}
