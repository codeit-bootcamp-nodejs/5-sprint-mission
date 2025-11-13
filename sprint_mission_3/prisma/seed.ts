import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("시드 데이터 시작");

  const email = "test@example.com";
  const hashed = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      nickname: "tester",
    },
    create: {
      email,
      nickname: "tester",
      password: hashed,
    },
  });
  console.log(`사용자 준비 완료 (id: ${user.id})`);

  const productName = "테스트";
  let product =
    (await prisma.product.findFirst({
      where: { name: productName, userId: user.id },
    })) ??
    (await prisma.product.create({
      data: {
        name: productName,
        description: "ts 마이그레이션 확인용 상품.",
        price: 19900,
        tags: ["테스트", "상품"],
        userId: user.id,
      },
    }));
  console.log(`상품 준비 완료 (id: ${product.id})`);

  const articleTitle = "ts 마이그레이션 게시글";
  let article =
    (await prisma.article.findFirst({
      where: { title: articleTitle, userId: user.id },
    })) ??
    (await prisma.article.create({
      data: {
        title: articleTitle,
        content: "시드 데이터.",
        userId: user.id,
      },
    }));
  console.log(`게시글 준비 완료 (id: ${article.id})`);

  const commentContent = "댓글 시드 테스트";
  let comment =
    (await prisma.comment.findFirst({
      where: {
        content: commentContent,
        userId: user.id,
        productId: product.id,
      },
    })) ??
    (await prisma.comment.create({
      data: {
        content: commentContent,
        userId: user.id,
        productId: product.id,
      },
    }));
  console.log(`댓글 준비 완료 (id: ${comment.id})`);

  console.log("시드 데이터 완료!");
}

main()
  .catch((e) => {
    console.error("시드 실행 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
