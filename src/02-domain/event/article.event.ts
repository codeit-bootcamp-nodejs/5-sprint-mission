// domain/events/article-created.event.ts
export class ArticleCreatedEvent {
  constructor(
    public readonly articleId: string,
    public readonly authorId: string,
  ) {}
}
