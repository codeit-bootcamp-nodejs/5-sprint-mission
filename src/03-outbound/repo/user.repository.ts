import { PrismaClient } from "@prisma/client/extension";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "../../02-domain/port/repositories/I.user.repository";
import { Prisma } from "@prisma/client";





export type PersistUser = Prisma.UserGetPayload<{}>;


export class UserRepository extends BaseRepository implements IUserRepository {
    constructor(prisma: PrismaClient) {
        super(prisma)
    }

    async save({ email, nickname, hashPassword, refreshToken }:
        { email: string, nickname: string, hashPassword: string, refreshToken: string }) {
        const user = await this.prisma.user.create({
            data: {
                email: email,
                nickname: nickname,
                password: hashPassword,
                refreshToken: refreshToken
            }
        });

        return user;
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        return user;
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        return user;
    }

    async updateById({ userId, info }:
        { userId: string, info: any }) {

        const updateUser = await this.prisma.user.update({
            where: { id: userId },
            data: info
        });

        return updateUser;
    }

    async updateUser({id, data}:{
        id: string, data: any
    }) {


        return await this.prisma.user.update({
            where: { id },
            data: data
        });
    }
}   