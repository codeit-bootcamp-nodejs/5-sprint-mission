export interface ProductView {
    id: string
    name: string
    description: string
    price: number
    tags: string[]
    imageUrl?: string
    likeCount: number
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