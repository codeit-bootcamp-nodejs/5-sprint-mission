type UserAttrs = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  nickname: string;
  image?: string | null;
  hasedPassword?: string;
  password?: string;
};

export type NewUserAttrs = Pick<UserAttrs, "email" | "nickname" | "image"> & {
  hasedPassword: string;
};

export type PersistedUserRecord = Required<
  Pick<UserAttrs, "id" | "createdAt" | "updatedAt">
> &
  Pick<UserAttrs, "email" | "nickname" | "image"> & {
    password?: string;
    hasedPassword?: string;
  };

export type UpdateUserAttrs = Partial<
  Pick<NewUserAttrs, "email" | "nickname" | "hasedPassword"> & {
    image?: string | null;
  }
>;

export type PersistedUserEntity = UserEntity;

export class UserEntity {
  private readonly _id?: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _email: string;
  private _hasedPassword: string;
  private _nickname: string;
  private _image?: string | null;

  constructor(attrs: UserAttrs) {
    this._id = attrs.id;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
    this._email = attrs.email;
    this._hasedPassword = attrs.hasedPassword ?? attrs.password ?? "";
    this._nickname = attrs.nickname;
    this._image = attrs.image;
  }

  static createNew(attrs: NewUserAttrs): UserEntity {
    return new UserEntity(attrs);
  }

  static fromPersisted(record: PersistedUserRecord): UserEntity {
    return new UserEntity(record);
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get hasedPassword() {
    return this._hasedPassword;
  }

  get nickname() {
    return this._nickname;
  }

  get image() {
    return this._image;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
