    import { PrismaClient } from "@prisma/client/extension";
    import { Product } from "../03-domain/entity/product.js";
    import { BaseRepository } from "./base.repository.js"



    export class ProductRepository extends BaseRepository {
        constructor(prisma) {
            super(prisma)
        }

        async findAll(query) {

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
                skip: parseInt(offset),
                take: parseInt(limit),
                orderBy: {
                    createdAt: sort,
                },
            });

            const productEntities = products.map((product) => {
                return Product.forCreate(product);
            });

            return productEntities;
        }

        async findById(id) {
            const product = await this.prisma.product.findUnique({
                where: {
                    id: id, // Replace 'your_user_id_here' with the actual ID
                },
            });
            return Product.forCreate(product);
        }

        async save(entity) {

            const { id, name, description, price, tags, createdAt, updatedAt, userId } = entity;

            const product = await this.prisma.product.create({
                data: {
                    id: id,
                    name: name,
                    description: description,
                    price: price,
                    tags: tags,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                    userId: userId
                }
            });

            return Product.forCreate(product);
        }

        async updateById(entity) {
            const { id, name, description, price, tags, createdAt, updatedAt } = entity;

            const product = await this.prisma.product.update({
                where: { id },
                data: {
                    name: name,
                    description: description,
                    price: price,
                    tags: tags,
                    createdAt: createdAt,
                    updatedAt: updatedAt
                }
            });

            return Product.forCreate(product);
        }

        async deleteById(id) {
            await this.prisma.product.delete({
                where: {
                    id: id
                },
            });
        }

        async findByUserId(userId) {
            const products = await this.prisma.product.findMany({
                where: { userId }
            });


            const productList = products.map((product) => {

                return Product.forCreate(product)
            });

            return productList;

        }


        async likeById(id, like) {


            const product = await this.prisma.product.update({
                where: { id },
                data: { isLiked: like },
            });
            return Product.forCreate(product);
        }
    }