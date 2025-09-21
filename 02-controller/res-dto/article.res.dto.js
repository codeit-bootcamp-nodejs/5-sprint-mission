export class ArticleResDto {
    id
    title
    content
    createdAt
    updatedAt

    constructor({ id, title, content, createdAt, updatedAt }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}