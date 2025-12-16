import { User } from "../../domain/entities/user.entity";

export class UserPresenter {
  toResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  toAuthResponse(
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    return {
      user: this.toResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  toCreateResponse(user: User) {
    return this.toResponse(user);
  }
}
