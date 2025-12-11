import { UserSignInDto, UserSignUpDto } from "../../01-inbound/request/req.validator";
import { Authenticator, HttpError } from "../../external/authenticator";
import { PersistedProduct } from "../entity/product";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductResDto } from "../../01-inbound/response/product.response";






export const createUserService = (repos: IBaseRepository, auth: Authenticator) => {
   


    const createUser = async (dto: UserSignUpDto) => {
        const { email, nickname, password } = dto;
        const refreshToken = auth.createToken({ email }, 'refresh');
        const hashPassword = await auth.createHashPassword(password);
        const newUser = await repos.user.save({ email, nickname, hashPassword, refreshToken });
        return auth.filterSensitiveUserData(newUser);
        auth = auth;
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
        console.log(refreshToken);
        // await repos.userRepo.updateUser({savedUser.id, refreshToken }); // 추가

        return { accessToken, refreshToken };
    }

    const getInfo = async (userId: string) => {
        const savedUser = await repos.user.findById(userId);
        return auth.filterSensitiveUserData(savedUser);
    }

    const updateUser = async (params: { userId: string, info: any }) => {
        const { userId, info } = params;
        if (info.password) {
            info.password = await auth.createHashPassword(info.password);
        }

        const updatedUser = await repos.user.updateById({ userId, info });
        return auth.filterSensitiveUserData(updatedUser);
    }

    const getUserProducts = async (userId: string) => {
        const productEntities = await repos.product.findByUserId(userId);
        const productDtos = productEntities.map((entity: PersistedProduct) => new ProductResDto(entity));

        return productDtos;
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