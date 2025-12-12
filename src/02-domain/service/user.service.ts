import { UserSignInDto, UserSignUpDto } from "../../01-inbound/request/req.validator";
import { Authenticator, AuthenticatorType, HttpError } from "../../external/authenticator";
import { PersistedProduct } from "../entity/product";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductResDto } from "../../01-inbound/response/product.response";
import { UserEntity } from "../entity/user.entity";






export const createUserService = (repos: IBaseRepository, auth: AuthenticatorType) => {



    const createUser = async (dto: UserSignUpDto) => {
        const { email, nickname, password } = dto;
        const refreshToken = auth.createToken({ email }, 'refresh');
        const hashPassword = await auth.createHashPassword(password);
        const newUserEntity = UserEntity.createNew({
            email,
            nickname,
            password: hashPassword,
            refreshToken
        });
        const newUser = await repos.user.save(newUserEntity);
        return auth.filterSensitiveUserData(newUser);
    }



    const getTokens = async (dto: UserSignInDto) => {
        const { email, password } = dto;
        const savedUser = await repos.user.findByEmail(email);
        if (!savedUser) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }

        await auth.verifyPassword(password, savedUser.password);
        const accessToken = auth.createToken(savedUser);
        const refreshToken = auth.createToken(savedUser, 'refresh');
        const updatedUser = UserEntity.createNew({
            ...savedUser,
            refreshToken
        })
        await repos.user.update(savedUser, updatedUser);
        return { accessToken, refreshToken };
    }

    const getInfo = async (userId: string) => {
        const savedUser = await repos.user.findById(userId);
        return auth.filterSensitiveUserData(savedUser);
    }

    const updateUser = async (dto: UserSignInDto) => {
        const { userId, nickname, email, password } = dto;
        const hashPassword = await auth.createHashPassword(password);
        const refreshToken = auth.createToken({ email }, 'refresh');

        const foundUser = await repos.user.findById(userId);
        if (!foundUser) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }

        const updatedUser = UserEntity.createNew({
            email,
            nickname,
            refreshToken,
            password: hashPassword
        });

        const userUpdated = await repos.user.update(foundUser, updatedUser);
        return auth.filterSensitiveUserData(userUpdated);
    }

    const getUserProducts = async (userId: string) => {
        const productEntities = await repos.product.findByUserId(userId);
        return productEntities.map(
            (entity: PersistedProduct) => new ProductResDto(entity)
        );
    }

    return {
        createUser,
        getTokens,
        getInfo,
        updateUser,
        getUserProducts
    }
}


export type UserServiceType = ReturnType<typeof createUserService>;