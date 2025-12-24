export type NewUserEntity = Omit<UserEntity, "id" | "createdAt" | "updatedAt">;
export type PersistedUserEntity = UserEntity & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserEntity = {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  email: string;
  nickname: string;
  password: string;
  refreshToken: string;
  readonly image?: string;
};

export const UserEntity = {
  createNew: (params: {
    email: string;
    nickname: string;
    password: string;
    refreshToken: string;
    image?: string;
  }) => {
    return {
      email: params.email,
      nickname: params.nickname,
      password: params.password,
      refreshToken: params.refreshToken,
      image: params.image,
    } as NewUserEntity;
  },

  createPersist: (params: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    nickname: string;
    password: string;
    refreshToken: string;
    image?: string;
  }) => {
    return {
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      email: params.email,
      nickname: params.nickname,
      password: params.password,
      refreshToken: params.refreshToken,
      image: params.image,
    } as PersistedUserEntity;
  },
};
