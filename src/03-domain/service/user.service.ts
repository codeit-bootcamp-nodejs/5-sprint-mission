import { UserRequest } from "../../02-controller/req-validator/req.validator";
import { ProductResDto } from "../../02-controller/res-dto/product.res.dto";
import { IBaseRepository } from "../../04-repository/I.base.repository";
import { Authenticator, HttpError } from "../../external/authenticator";
import { Product } from "../entity/product";



export interface IUserService {

    createUser(user: UserRequest): any
    getTokens(user: any): any

    getInfo(userId: string): Promise<any>

    updateUser({ userId, info }: { userId: string, info: any }): Promise<any>

    getUserProducts(userId: string): Promise<ProductResDto[]>
}


export class UserService implements IUserService {
    #repos
    #auth

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
        this.#auth = auth;
    }


    async createUser(request: UserRequest) {
        const { email, nickname, password } = request.body;
        const { refreshToken } = request.cookie;

        console.log("refresh token");
        console.log(request.cookie);
        console.log(refreshToken);

        const hashPassword = await this.#auth.createHashPassword(password);
        const newUser = await this.#repos.userRepo.save({ email, nickname, hashPassword, refreshToken });
        return this.#auth.filterSensitiveUserData(newUser);
    }

    async getTokens(user: any) {
        const { email, password } = user;
        const savedUser = await this.#repos.userRepo.findByEmail(email);
        if (!user) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }

        await this.#auth.verifyPassword(password, savedUser.password);
        const accessToken = this.#auth.createToken(savedUser);
        const refreshToken = this.#auth.createToken(savedUser, 'refresh');

        // await this.#repos.userRepo.updateUser({savedUser.id, refreshToken }); // 추가

        return { accessToken, refreshToken };
    }

    async getInfo(userId: string) {
        const savedUser = await this.#repos.userRepo.findById(userId);
        return this.#auth.filterSensitiveUserData(savedUser);
    }

    async updateUser({ userId, info }: { userId: string, info: any }) {
        if (info.password) {
            info.password = await this.#auth.createHashPassword(info.password);
        }

        const updatedUser = await this.#repos.userRepo.updateById({ userId, info });
        return this.#auth.filterSensitiveUserData(updatedUser);
    }

    async getUserProducts(userId: string) {
        const productEntities = await this.#repos.productRepo.findByUserId(userId);
        const productDtos = productEntities.map((entity: Product) => new ProductResDto(entity));

        return productDtos;
    }
}
