import { PrismaClient } from "@prisma/client/extension";
import { NewProduct, PersistedProduct, Product } from "../../02-domain/entity/product";
import { BaseRepository } from "./base.repository";
import { ProductReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { IProductRepository } from "../../02-domain/port/repositories/I.product.repository";
import { Prisma } from "@prisma/client";
import { ProductMapper } from "../mapper/product.mapper";






export type PersistProduct = Prisma.ProductGetPayload<{}>;



export class ProductRepository extends BaseRepository implements IProductRepository {
    constructor(prisma: PrismaClient) {
        super(prisma)
    }


    async save(entity: NewProduct) {
        const { name, description, price, tags, userId } = entity;

        const product = await this.prisma.product.create({
            data: {
                name,
                description,
                price,
                tags,
                userId
            }
        });

        return ProductMapper.toPersist(product);
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

        const productEntities = products.map((product: PersistProduct) => {
            return ProductMapper.toPersist(product);
        });

        return productEntities;
    }

    async findById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        return ProductMapper.toPersist(product);
    }


    async findByUserId(userId: string) {
        const products = await this.prisma.product.findMany({
            where: { userId }
        });


        const productList = products.map((product: PersistProduct) => {

            return ProductMapper.toPersist(product);
        });

        return productList;

    }


    async updateById(entity: PersistedProduct) {
        const { id, name, description, price, tags, userId } = entity;

        const product = await this.prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                tags,
                userId
            }
        });

        return ProductMapper.toPersist(product);
    }


    async deleteById(id: string) {
        await this.prisma.product.delete({
            where: { id },
        });
    }


    async like(entity: PersistedProduct) {
        const product = await this.prisma.product.update({
            where: { id: entity.id },
            data: { isLiked: entity.isLiked },
        });
        return ProductMapper.toPersist(product);
    }
}