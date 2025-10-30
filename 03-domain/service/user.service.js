import { ProductResDto } from "../../02-controller/res-dto/product.res.dto.js";


export class UserService {
    #repos
    #auth

    constructor(repos, auth) {
        this.#repos = repos;
        this.#auth = auth;
    }


    async createUser(user) {
        const { email, nickname, password } = user;

        const hashPassword = await this.#auth.createHashPassword(password);

        const newUser = await this.#repos.userRepo.save({ email, nickname, hashPassword });
        return this.#auth.filterSensitiveUserData(newUser);
    }

    async getTokens(user) {
        const { email, password } = user;
        const savedUser = await this.#repos.userRepo.findByEmail(email);
        if (!user) {
            const error = new Error('Unauthorized');
            error.code = 401;
            throw error;
        }


        await this.#auth.verifyPassword(password, savedUser.password);
        const accessToken = this.#auth.createToken(savedUser);
        const refreshToken = this.#auth.createToken(savedUser, 'refresh');
        await this.#repos.userRepo.updateUser(savedUser.id, { refreshToken }); // 추가

        return { accessToken, refreshToken };
    }

    async getInfo(userId) {
        const savedUser = await this.#repos.userRepo.findById(userId);
        return this.#auth.filterSensitiveUserData(savedUser);
    }

    async updateUser({ userId, info }) {
        if (info.password) {
            info.password = await this.#auth.createHashPassword(info.password);
        }

        const updatedUser = await this.#repos.userRepo.updateById({ userId, info });
        return this.#auth.filterSensitiveUserData(updatedUser);
    }

    async getUserProducts(userId) {
        const productEntities = await this.#repos.productRepo.findByUserId(userId);
        const productDtos = productEntities.map((entity) => new ProductResDto(entity));

        return productDtos;
    }
}
