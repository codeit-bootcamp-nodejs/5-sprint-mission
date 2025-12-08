import { PrismaClient } from "@prisma/client/extension";
import { Product } from "../../02-domain/entity/product";
import { BaseRepository } from "./base.repository";
import { ProductRequest, QueryType } from "../../01-inbound/request/req.validator";





export interface IProductRepository {


    save(dto: ProductRequest): Promise<Product>;
    findById(id: string): Promise<Product>;
    likeById(id: string, like: boolean): Promise<Product>;
    findAll(query: QueryType): Promise<Product[]>;
    updateById(dto: ProductRequest): Promise<Product>
    deleteById(id: string): void;
    findByUserId(userId: string): Promise<Product[]>

}


export class ProductRepository extends BaseRepository implements IProductRepository {
    constructor(prisma: PrismaClient) {
        super(prisma)
    }

    async findAll(query: QueryType) {

        const { offset = 0, limit = 10, search = "", sort = "desc" } = query;

        const condition = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};

        const products = await this.prisma.product.findMany({
            where: condition,
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: sort,
            },
        });

        const productEntities = products.map((product: Product) => {
            return Product.forCreate(product);
        });

        return productEntities;
    }

    async findById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        return Product.forCreate(product);
    }

    async save(dto: ProductRequest) {
        const { name, description, price, tags } = dto.body
        const { userId } = dto.user;

        const product = await this.prisma.product.create({
            data: {
                name: name,
                description: description,
                price: price,
                tags: tags,
                userId: userId
            }
        });

        return Product.forCreate(product);
    }

    async updateById(dto: ProductRequest) {
        const { name, description, price, tags } = dto.body
        const { userId } = dto.user;
        const id = dto.params?.id;

        const product = await this.prisma.product.update({
            where: { id },
            data: {
                name: name,
                description: description,
                price: price,
                tags: tags,
                userId: userId
            }
        });

        return Product.forCreate(product);
    }

    async deleteById(id: string) {
        await this.prisma.product.delete({
            where: { id },
        });
    }

    async findByUserId(userId: string) {
        const products = await this.prisma.product.findMany({
            where: { userId }
        });


        const productList = products.map((product: Product) => {

            return Product.forCreate(product)
        });

        return productList;

    }


    async likeById(id: string, like: boolean) {


        const product = await this.prisma.product.update({
            where: { id },
            data: { isLiked: like },
        });
        return Product.forCreate(product);
    }
}