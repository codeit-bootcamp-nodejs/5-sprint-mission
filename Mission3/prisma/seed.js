import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('1234', 10);
  const user = await prisma.user.create({
    data: {
      email: 'asd@asd.com',
      nickname: 'asd',
      password: hashedPassword,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: '노트북',
        description: '게이밍 노트북',
        price: 3000000,
        tags: ['전자제품', '게임'],
        authorId: user.id,
      },
      {
        name: '축구공',
        description: '공식 경기용 축구공',
        price: 50000,
        tags: ['스포츠', '축구'],
        authorId: user.id,
      },
    ],
  });

  await prisma.article.createMany({
    data: [
      {
        title: '첫 번째 글',
        content: '자유게시판에 오신 것을 환영합니다!',
        authorId: user.id,
      },
      {
        title: '두 번째 글',
        content: '오늘은 날씨가 많이 서늘해졌어요.',
        authorId: user.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
