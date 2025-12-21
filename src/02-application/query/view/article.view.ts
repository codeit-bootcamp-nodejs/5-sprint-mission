export interface ArticleView {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
    author: {
        nickname: string
    }
    comments: {
        nickname: string
        content: string
    }[]
}