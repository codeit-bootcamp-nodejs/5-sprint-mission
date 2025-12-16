import { ID, TimestampFields } from "../../common/types/common";

export class User implements TimestampFields {
  id: ID;
  email: string;
  nickname: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: ID;
    email: string;
    nickname: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.nickname = data.nickname;
    this.image = data.image;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isUser(userId: ID): boolean {
    return this.id === userId;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidNickname(nickname: string): boolean {
    return nickname.length >= 2 && nickname.length <= 20;
  }

  static isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  update(data: { nickname?: string; image?: string | null }): void {
    if (data.nickname) this.nickname = data.nickname;
    if (data.image !== undefined) this.image = data.image;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nickname: this.nickname,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
