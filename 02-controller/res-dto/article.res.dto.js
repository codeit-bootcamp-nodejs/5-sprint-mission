export class ArticleResDto {
    id
    title
    content
    createdAt
    updatedAt
    userId

    constructor({ id, title, content, createdAt, updatedAt, userId }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }
}