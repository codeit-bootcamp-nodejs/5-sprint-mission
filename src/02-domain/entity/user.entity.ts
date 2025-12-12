

export type NewUserEntity = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>;
export type PersistedUserEntity = UserEntity & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserEntity {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    email: string;
    nickname: string;
    password: string;
    refreshToken: string;
    image?: string 

    private constructor(params: {
        id?: string;
        createdAt?: Date;
        updatedAt?: Date;
        email: string;
        nickname: string;
        password: string;
        refreshToken: string;
        image?: string;
    }) {
        this.id = params.id;    
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.email = params.email;
        this.nickname = params.nickname;
        this.password = params.password;
        this.refreshToken = params.refreshToken;
        this.image = params.image;
    }

    static createNew(params: {
        email: string;
        nickname: string;
        password: string;
        refreshToken: string;
        image?: string;
    }) {
        return new UserEntity({
            email: params.email,
            nickname: params.nickname,
            password: params.password,
            refreshToken: params.refreshToken,
            image: params.image,
        }) as NewUserEntity;
    }

    static createPersist(params: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        nickname: string;
        password: string;
        refreshToken: string;
        image?: string;
    }) {
        return new UserEntity({
            id: params.id,  
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
            email: params.email,
            nickname: params.nickname,
            password: params.password,
            refreshToken: params.refreshToken,
            image: params.image,
        }) as PersistedUserEntity;
    }
}