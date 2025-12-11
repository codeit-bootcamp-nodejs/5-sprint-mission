import { PrismaClient } from "@prisma/client/extension";
import { NewProduct, PersistedProduct } from "../../02-domain/entity/product";
import { QueryType } from "../../01-inbound/request/req.validator";
import { Prisma } from "@prisma/client";
import { ProductMapper } from "../mapper/product.mapper";






export type PersistProduct = Prisma.ProductGetPayload<{}>;



export const createProductRepository = (prisma: PrismaClient) => {


    const save = async (entity: NewProduct) => {
        const { name, description, price, tags, userId } = entity;

        const product = await prisma.product.create({
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


    const findAll = async (query: QueryType) => {

        const { offset = 0, limit = 10, search = "", sort = "desc" } = query;

        const condition = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};

        const products = await prisma.product.findMany({
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

    const findById = async (id: string) => {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        return ProductMapper.toPersist(product);
    }


    const findByUserId = async (userId: string) => {
        const products = await prisma.product.findMany({
            where: { userId }
        });


        const productList = products.map((product: PersistProduct) => {

            return ProductMapper.toPersist(product);
        });

        return productList;

    }


    const update = async (foundEntity: PersistedProduct, newEntity: NewProduct) => {
        const { id } = foundEntity;
        const { name, description, price, tags, userId } = newEntity;

        const product = await prisma.product.update({
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


    const deleteById = async (id: string) => {
        await prisma.product.delete({
            where: { id },
        });
    }


    const like = async (entity: PersistedProduct) => {
        const product = await prisma.product.update({
            where: { id: entity.id },
            data: { isLiked: entity.isLiked },
        });
        return ProductMapper.toPersist(product);
    }

    return {
        save,
        findAll,
        findById,
        findByUserId,
        update,
        deleteById,
        like
    }
}