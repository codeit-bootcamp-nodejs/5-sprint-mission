import { BaseRepository } from "./base.repository.js";

export class UserRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma)
    }

    async save({ email, nickname, hashPassword }) {
        const user = await this.prisma.user.create({
            data: {
                email: email,
                nickname: nickname,
                password: hashPassword
            }
        });

        return user;
    }

    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        return user;
    }

    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        return user;
    }

    async updateById({ userId, info }) {

        const updateUser = await this.prisma.user.update({
            where: { id: userId },
            data: info
        });

        return updateUser;
    }

    async updateUser(id, data) {


        return await this.prisma.user.update({
            where: { id },
            data: data
        });
    }
}   