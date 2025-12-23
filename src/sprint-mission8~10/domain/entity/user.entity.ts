import { BusinessExceptionType } from "../../shared/const/business.exception.info";
import { BusinessException } from "../../shared/exceptions/business.exception";
import { IHashManager } from "../port/managers/hash.manager.interface";
import { BaseEntity } from "./base.entity";


export type NewUserEntity = Omit<
  UserEntity,
  "id" | "createdAt" | "updatedAt"
>

export interface PersistUserEntity extends UserEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends BaseEntity<string> {
  private readonly _email: string;
  private _nickname: string;
  private _image?: string;
  private _password: string;
  private _refreshToken?: string;

  constructor(attributes: {
    id?: string;
    email: string;
    nickname: string;
    image?: string;
    password: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(attributes.id, attributes.createdAt, attributes.updatedAt);
    this._email = attributes.email;
    this._nickname = attributes.nickname;
    this._image = attributes.image;
    this._password = attributes.password;
    this._refreshToken = attributes.refreshToken;
  }

  static async createNew(params: {
    email: string;
    nickname: string;
    image?: string;
    password: string;
    hashManager: IHashManager
  }): Promise<NewUserEntity> {
    const hashedPassword = await params.hashManager.hash(params.password);

    return new UserEntity({
      ...params,
      password: hashedPassword
    }) as NewUserEntity;
  }

  static createPersist(params: {
    id: string;
    email: string;
    nickname: string;
    image?: string;
    password: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }): PersistUserEntity {
    if (params.email) {
      this.validateEmailRule(params.email);
    }
    if (params.nickname) {
      this.validateEmailRule(params.nickname);
    }
    return new UserEntity(params) as PersistUserEntity;
  }

  update(params: {
    nickname?: string;
    image?: string;

  }): void {
    if (params.nickname) {
      UserEntity.validateNicknameRule(params.nickname);
      this._nickname = params.nickname;
    }
    if (params.image) {
      this._image = params.image;
    }
  }

  async isPasswordMatch(password: string, hashManager: IHashManager): Promise<boolean> {
    return await hashManager.compare(password, this._password);
  }

  async updatePassword(newPassword: string, hashManager: IHashManager): Promise<void> {
    this._password = await hashManager.hash(newPassword);
  }

  async isRefreshTokenMatch(refreshToken: string, hashManager: IHashManager): Promise<boolean> {
    if(!this._refreshToken) {
      throw new BusinessException({type: BusinessExceptionType.REFRESHTOKEN_NOT_EXIST});
    }

    return await hashManager.compare(refreshToken, this._refreshToken);
  }

  async updateRefreshToken(
    refreshToken: string,
    hashManager: IHashManager,
  ): Promise<void> {
    if (!this._refreshToken) {
      this._refreshToken = await hashManager.hash(refreshToken);
      return;
    }

    if (
      await hashManager.compare(refreshToken, this._refreshToken)
    ) {
      return;
    }

    this._refreshToken = await hashManager.hash(refreshToken);
    return;
  }

  deleteRefreshToken(): void {
    this._refreshToken = undefined;
  }
  
  static validateEmailRule(email: string) {
    if (email.length > 30) {
      throw new BusinessException({ type: BusinessExceptionType.EMAIL_TOO_LONG });
    }
  }

  static validateNicknameRule(nickname: string) {
    if (nickname.length > 10) {
      throw new BusinessException({ type: BusinessExceptionType.NICKNAME_TOO_LONG });
    }
  }

  get email() {
    return this._email;
  }
  get nickname() {
    return this._nickname;
  }
  get image() {
    return this._image;
  }
  get password() {
    return this._password;
  }
  get refreshToken() {
    return this._refreshToken;
  }
}
