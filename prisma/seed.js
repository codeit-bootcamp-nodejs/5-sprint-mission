import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { PRODUCTS, ARTICLES, COMMENTS } from "./mock.js";

async function main() {
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
    await prisma.comment.deleteMany();

    await prisma.product.createMany({
        data: PRODUCTS,
        skipDuplicates: true,
    });

    await prisma.article.createMany({
        data: ARTICLES,
        skipDuplicates: true,
    });

    await prisma.comment.createMany({
        data: COMMENTS,
        skipDuplicates: true,
    });
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally((async () => {
        await prisma.$disconnect();
    }))