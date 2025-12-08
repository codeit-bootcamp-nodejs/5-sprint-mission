import { NewUserEntity, PersistedUserEntity } from "../../../02-domain/entity/user.entity"
import { UserSignInDto, UserSignUpDto } from "../../request/req.validator"
import { ProductResDto } from "../../response/product.res.dto"

export interface IUserService {
    createUser(user: UserSignInDto): any
    getTokens(user: UserSignUpDto): any

    getInfo(userId: string): Promise<PersistedUserEntity>
    updateUser(params: { userId: string, info: any }): Promise<PersistedUserEntity>

    getUserProducts(userId: string): Promise<ProductResDto[]>
}