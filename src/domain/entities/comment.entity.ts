import { ID, TimestampFields } from "../../common/types/common";

export class Comment implements TimestampFields {
  id: ID;
  content: string;
  userId: ID;
  articleId?: ID | null;
  productId?: ID | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: ID;
    content: string;
    userId: ID;
    articleId?: ID | null;
    productId?: ID | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.content = data.content;
    this.userId = data.userId;
    this.articleId = data.articleId;
    this.productId = data.productId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isWrittenBy(userId: ID): boolean {
    return this.userId === userId;
  }

  canBeModifiedBy(userId: ID): boolean {
    return this.isWrittenBy(userId);
  }

  canBeDeletedBy(userId: ID): boolean {
    return this.isWrittenBy(userId);
  }

  isArticleComment(): boolean {
    return this.articleId !== undefined && this.articleId !== null;
  }

  isProductComment(): boolean {
    return this.productId !== undefined && this.productId !== null;
  }

  updateContent(content: string): void {
    this.content = content;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      userId: this.userId,
      articleId: this.articleId,
      productId: this.productId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
