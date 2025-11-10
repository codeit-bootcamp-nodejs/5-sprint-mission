import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "노트북", description: "게이밍 노트북", price: 3000000, tags: ["전자제품", "게임"] },
      { name: "축구공", description: "공식 경기용 축구공", price: 50000, tags: ["스포츠", "축구"] },
    ]
  });

  await prisma.article.createMany({
    data: [
      { title: "첫 번째 글", content: "자유게시판에 오신 것을 환영합니다!" },
      { title: "두 번째 글", content: "오늘은 2025년 9월 11일 목요일, 날씨가 많이 서늘해졌어요." },
    ]
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });