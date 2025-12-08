import { Article } from "@prisma/client"

export class ArticleResDto {
    id
    title
    content
    createdAt
    updatedAt
    userId

    constructor(entity: Article) {
        const { userId, id, title, content, createdAt, updatedAt } = entity;
        
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }
}