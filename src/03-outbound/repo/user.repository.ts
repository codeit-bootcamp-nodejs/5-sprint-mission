import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";





export type PersistUser = Prisma.UserGetPayload<{}>;


export const createUserRepository = (prisma: PrismaClient) => {

    const save = async ({ email, nickname, hashPassword, refreshToken }:
        { email: string, nickname: string, hashPassword: string, refreshToken: string }) => {
        const user = await prisma.user.create({
            data: {
                email: email,
                nickname: nickname,
                password: hashPassword,
                refreshToken: refreshToken
            }
        });

        return user;
    }

    const findById = async (id: string) => {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        return user;
    }

    const findByEmail = async (email: string) => {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        return user;
    }

    const updateById = async ({ userId, info }:
        { userId: string, info: any }) => {

        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: info
        });

        return updateUser;
    }

    const updateUser = async ({ id, data }: {
        id: string, data: any
    }) => {


        return await prisma.user.update({
            where: { id },
            data: data
        });
    }

    return {
        save,
        findById,
        findByEmail,
        updateById,
        updateUser
    }
}   