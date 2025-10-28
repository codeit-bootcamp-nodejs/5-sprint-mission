import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("시드 데이터 시작");

  const hashed = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      nickname: "tester",
      password: hashed,
    },
  });
  console.log(`사용자 생성 완료 (id: ${user.id})`);

  const product = await prisma.product.create({
    data: {
      name: "테스트",
      description: "ts 마이그레이션 확인용 상품.",
      price: 19900,
      tags: ["테스트", "상품"],
      userId: user.id,
    },
  });
  console.log(`상품 생성 완료 (id: ${product.id})`);

  const article = await prisma.article.create({
    data: {
      title: "ts 마이그레이션 게시글",
      content: "시드 데이터.",
      userId: user.id,
    },
  });
  console.log(`게시글 생성 완료 (id: ${article.id})`);

  const comment = await prisma.comment.create({
    data: {
      content: "댓글 시드 테스트",
      userId: user.id,
      productId: product.id,
    },
  });
  console.log(`댓글 생성 완료 (id: ${comment.id})`);

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
