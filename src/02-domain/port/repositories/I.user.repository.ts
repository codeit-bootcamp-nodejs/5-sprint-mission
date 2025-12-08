export interface IUserRepository {
    save({ email, nickname, hashPassword, refreshToken }:
        { email: string, nickname: string, hashPassword: string , refreshToken: string}
    ): any

    findById(id: string): any

    findByEmail(email: string): any

    updateById({ userId, info }:
        { userId: string, info: any }
    ): any

    updateUser({ id, data }: {
        id: string, data: any
    }): any

}

