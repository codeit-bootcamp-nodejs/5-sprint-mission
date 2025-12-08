import { request } from "express";
import { UserSignInDto, UserSignUpDto } from "../../01-inbound/request/req.validator";
import { ProductResDto } from "../../01-inbound/response/product.res.dto";
import { IBaseRepository } from "../../03-outbound/I.base.repository";
import { Authenticator, HttpError } from "../../external/authenticator";
import { Product } from "../entity/product";
import { IUserService } from "../../01-inbound/port/services/i.user.service";






export class UserService implements IUserService {
    #repos
    #auth

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
        this.#auth = auth;
    }


    async createUser(dto: UserSignUpDto) {
        const { email, nickname, password } = dto;
        const refreshToken = this.#auth.createToken({ email }, 'refresh');
        const hashPassword = await this.#auth.createHashPassword(password);
        const newUser = await this.#repos.userRepo.save({ email, nickname, hashPassword, refreshToken });
        return this.#auth.filterSensitiveUserData(newUser);
        // return newUser;
    }

    async getTokens(dto: UserSignInDto) {
        const { email, password } = dto;
        const savedUser = await this.#repos.userRepo.findByEmail(email);
        if (!savedUser) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }

        await this.#auth.verifyPassword(password, savedUser.password);
        const accessToken = this.#auth.createToken(savedUser);
        const refreshToken = this.#auth.createToken(savedUser, 'refresh');
        console.log(refreshToken);
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
