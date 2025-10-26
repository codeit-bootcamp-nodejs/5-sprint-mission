import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.likeArticle.deleteMany();
  await prisma.likeProduct.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("wlgp0918", 10);
  const user = await prisma.user.create({
    data: {
      email: "wlgp@wlgpwlgp.com",
      nickname: "wlgp",
      password,
    },
  });

  const p1 = await prisma.product.create({
    data: {
      name: "바디로션",
      description: "보들보들해짐",
      price: 21900,
      tags: ["로션", "부드럽다"],
      userId: user.id, 
    },
  });

  const a1 = await prisma.article.create({
    data: {
      title: "안녕안녕",
      content: "지혜입니당!",
      userId: user.id, 
    },
  });

  await prisma.comment.createMany({
    data: [
      { productId: p1.id, content: "관심!!", userId: user.id },
      { articleId: a1.id, content: "환영!!", userId: user.id },
    ],
  });

  console.log("seed 끝");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
