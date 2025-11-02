import { PrismaClient, User, Product, Article } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.productLikes.deleteMany();
  await prisma.articleLikes.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const user1: User = await prisma.user.create({
    data: {
      email: "user1@example.com",
      nickname: "홍길동",
      password: passwordHash,
    },
  });

  const user2: User = await prisma.user.create({
    data: {
      email: "user2@example.com",
      nickname: "김철수",
      password: passwordHash,
    },
  });

  const product1: Product = await prisma.product.create({
    data: {
      name: "iPhone 13",
      description: "128GB, 상태 좋음",
      price: 850000,
      tags: ["apple", "phone"],
      userId: user1.id,
    },
  });

  const product2: Product = await prisma.product.create({
    data: {
      name: "Galaxy S22",
      description: "상태 양호",
      price: 650000,
      tags: ["samsung", "phone"],
      userId: user1.id,
    },
  });

  const article1: Article = await prisma.article.create({
    data: {
      title: "첫 글입니다",
      content: "안녕하세요! 게시판 테스트 글이에요.",
      userId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "아이폰 관심있어요!",
      productId: product1.id,
      userId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "가격 네고 가능할까요?",
      productId: product2.id,
      userId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "잘 읽었습니다",
      articleId: article1.id,
      userId: user1.id,
    },
  });

  await prisma.productLikes.create({
    data: { userId: user2.id, productId: product1.id },
  });

  await prisma.articleLikes.create({
    data: { userId: user1.id, articleId: article1.id },
  });

  console.log("시딩 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
