import { ID, TimestampFields } from "../../common/types/common";

export class Article implements TimestampFields {
  id: ID;
  title: string;
  content: string;
  image?: string | null;
  userId: ID;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: ID;
    title: string;
    content: string;
    image?: string | null;
    userId: ID;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.image = data.image;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isOwnedBy(userId: ID): boolean {
    return this.userId === userId;
  }

  canBeModifiedBy(userId: ID): boolean {
    return this.isOwnedBy(userId);
  }

  canBeDeletedBy(userId: ID): boolean {
    return this.isOwnedBy(userId);
  }

  update(data: {
    title?: string;
    content?: string;
    image?: string | null;
  }): void {
    if (data.title) this.title = data.title;
    if (data.content) this.content = data.content;
    if (data.image !== undefined) this.image = data.image;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      image: this.image,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
