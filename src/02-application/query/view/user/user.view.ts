export interface UserView {
    id: string
    email: string
    nickname: string
    image?: string
    password: string
    createdAt: Date
    updatedAt: Date
    myProducts: {
        name: string
        price: number
        tags: string[]
        likeCount: number
    }[],

    myArticles: {
        title: string
        createdAt: Date
    }[],

    myComments: {
        article: {
            content: string
        }[],
        product: {
            content: string
        }[]
    }
}