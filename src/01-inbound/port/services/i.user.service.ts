import { UserSignInDto, UserSignUpDto } from "../../request/req.validator"
import { ProductResDto } from "../../response/product.res.dto"

export interface IUserService {
    createUser(user: UserSignInDto): any
    getTokens(user: UserSignUpDto): any

    getInfo(userId: string): Promise<any>

    updateUser({ userId, info }: { userId: string, info: any }): Promise<any>

    getUserProducts(userId: string): Promise<ProductResDto[]>
}