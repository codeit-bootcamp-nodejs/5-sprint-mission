export interface UserProductView {
    nickname: string;
    products: {
        name: string,
        createdAt: Date,
        likeCount: number
    }[];
}