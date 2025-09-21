import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  const product1 = await prisma.product.create({
    data: {
      name: 'iPhone 13',
      description: '128GB, 상태 좋음',
      price: 850000,
      tags: ['apple', 'phone'],
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Galaxy S22',
      description: '상태 양호',
      price: 650000,
      tags: ['samsung', 'phone'],
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: '첫 글입니다',
      content: '안녕하세요! 게시판 테스트 글이에요.',
    },
  });

  await prisma.comment.create({
    data: {
      content: '아이폰 관심있어요!',
      productId: product1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '가격 네고 가능할까요?',
      productId: product2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '잘 읽었습니다',
      articleId: article1.id,
    },
  });
  console.log('시딩 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
