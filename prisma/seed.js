import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  const p1 = await prisma.product.create({
    data: {
      name: "바디로션",
      description: "보들보들해짐",
      price: 21900,
      tags: ["lotion", "soft"],
    },
  });

  const a1 = await prisma.article.create({
    data: { title: "안녕안녕", content: "지혜입니당!" },
  });

  await prisma.comment.createMany({
    data: [
      { productId: p1.id, content: "관심있어요!" },
      { articleId: a1.id, content: "환영해요!" },
    ],
  });

  console.log("seed 끝");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
