type UserParams = {
  id?: number;
  email: string;
  hasedPassword: string;
  nickname: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PersistedUserEntity = UserEntity & { id: number };

export class UserEntity {
  private _id?;
  private _email;
  private _hasedPassword;
  private _nickname;
  private _image?;
  private _createdAt?;
  private _updatedAt?;

  constructor({
    id,
    email,
    hasedPassword,
    nickname,
    image,
    createdAt,
    updatedAt,
  }: UserParams) {
    this._id = id;
    this._email = email;
    this._hasedPassword = hasedPassword;
    this._nickname = nickname;
    this._image = image;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

get id(): number | undefined {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get hasedPassword(): string {
    return this._hasedPassword;
  }
  get nickname(): string {
    return this._nickname;
  }
  get image(): string | undefined {
    return this._image;
  }
  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
