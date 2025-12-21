export interface ArticleCommentView {
    id: string
    articleTitle: string
    content: string
    createdAt: Date
    updatedAt: Date
    author: {
        nickname: string
    }
}