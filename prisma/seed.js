import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시딩 시작...');

  // User 생성
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      nickname: '테스트유저',
      password: 'hashedpassword', // 실제 서비스에서는 해시된 비밀번호 사용
    },
  });

  // Article 데이터 생성
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Node.js 시작하기',
        content:
          'Node.js는 Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임입니다. Node.js를 사용하면 서버 사이드에서 JavaScript를 실행할 수 있습니다.',
        image: 'https://example.com/nodejs.jpg',
        userId: user.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'React 컴포넌트 최적화',
        content:
          'React 애플리케이션의 성능을 향상시키기 위한 컴포넌트 최적화 기법들을 알아봅시다. memo, useMemo, useCallback 등을 활용한 최적화 방법을 다룹니다.',
        image: 'https://example.com/react.jpg',
        userId: user.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'TypeScript 기초 가이드',
        content:
          'TypeScript는 JavaScript에 정적 타입을 추가한 언어입니다. 타입 안정성을 제공하여 더 안전하고 유지보수가 쉬운 코드를 작성할 수 있습니다.',
        image: 'https://example.com/typescript.jpg',
        userId: user.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Express.js로 API 서버 구축하기',
        content:
          'Express.js는 Node.js를 위한 빠르고 유연한 웹 애플리케이션 프레임워크입니다. RESTful API를 쉽게 구축할 수 있습니다.',
        image: null,
        userId: user.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Prisma ORM 사용법',
        content:
          'Prisma는 현대적인 데이터베이스 ORM입니다. 타입 안전성과 직관적인 API를 제공하여 데이터베이스 작업을 간편하게 만들어줍니다.',
        image: 'https://example.com/prisma.jpg',
        userId: user.id,
      },
    }),
  ]);

  console.log(`📝 ${articles.length}개의 Article이 생성되었습니다.`);

  // Product 데이터 생성
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'MacBook Pro 16인치',
        description:
          'Apple M3 Pro 칩이 탑재된 최신 MacBook Pro입니다. 뛰어난 성능과 긴 배터리 수명을 자랑합니다.',
        price: 3200000,
        tags: ['노트북', 'Apple', 'MacBook', '개발용'],
        images: [
          'https://example.com/macbook-1.jpg',
          'https://example.com/macbook-2.jpg',
          'https://example.com/macbook-3.jpg',
        ],
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'A17 Pro 칩과 티타늄 디자인을 적용한 프리미엄 스마트폰입니다.',
        price: 1350000,
        tags: ['스마트폰', 'Apple', 'iPhone'],
        images: ['https://example.com/iphone-1.jpg', 'https://example.com/iphone-2.jpg'],
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'LG 울트라기어 모니터 27인치',
        description: '144Hz 주사율과 1ms 응답속도를 지원하는 게이밍 모니터입니다.',
        price: 350000,
        tags: ['모니터', 'LG', '게이밍', '144Hz'],
        images: ['https://example.com/monitor-1.jpg', 'https://example.com/monitor-2.jpg'],
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: '로지텍 MX Master 3S',
        description: '정밀한 센서와 인체공학적 디자인을 갖춘 무선 마우스입니다.',
        price: 120000,
        tags: ['마우스', '로지텍', '무선', '인체공학'],
        images: ['https://example.com/mouse-1.jpg'],
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: '케이크론 K8 Pro 기계식 키보드',
        description:
          '75% 레이아웃의 프리미엄 기계식 키보드입니다. 핫스왑 지원으로 스위치 교체가 가능합니다.',
        price: 180000,
        tags: ['키보드', '기계식', '케이크론', '핫스왑'],
        images: ['https://example.com/keyboard-1.jpg', 'https://example.com/keyboard-2.jpg'],
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Pro 2세대',
        description: '개선된 액티브 노이즈 캔슬링과 공간 음향을 지원하는 무선 이어폰입니다.',
        price: 350000,
        tags: ['이어폰', 'Apple', 'AirPods', '노이즈캔슬링'],
        images: ['https://example.com/airpods-1.jpg'],
        userId: user.id,
      },
    }),
  ]);

  console.log(`🛍️ ${products.length}개의 Product가 생성되었습니다.`);

  // Article에 댓글 추가
  const articleComments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Node.js 정말 유용한 기술이네요! 저도 배워보고 싶습니다.',
        articleId: articles[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '이 글 덕분에 Node.js를 이해하는 데 도움이 되었습니다. 감사합니다!',
        articleId: articles[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'React 최적화에 대한 좋은 정보 감사합니다. useMemo와 useCallback에 대해 더 알아봐야겠어요.',
        articleId: articles[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'TypeScript 입문자에게 정말 도움이 되는 글이었습니다!',
        articleId: articles[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Express.js로 API 서버 만드는 과정이 상세히 설명되어 있어서 좋네요.',
        articleId: articles[3].id,
      },
    }),
  ]);

  // Product에 댓글 추가
  const productComments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'MacBook Pro 성능이 정말 좋다고 들었는데, 실제로 사용해보고 싶네요.',
        productId: products[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '가격이 좀 비싸긴 하지만 그만한 가치가 있을 것 같습니다.',
        productId: products[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'iPhone 15 Pro 카메라 성능이 정말 좋다고 하던데, 언제 출시되나요?',
        productId: products[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'LG 모니터 144Hz 정말 게임하기에 좋을 것 같아요!',
        productId: products[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '로지텍 마우스 인체공학적 디자인이 손목 건강에 도움이 될까요?',
        productId: products[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '기계식 키보드 타이핑감이 궁금하네요. 핫스왑 기능도 신기합니다.',
        productId: products[4].id,
      },
    }),
  ]);

  console.log(`💬 Article에 ${articleComments.length}개의 댓글이 추가되었습니다.`);
  console.log(`💬 Product에 ${productComments.length}개의 댓글이 추가되었습니다.`);
  console.log('🌱 시딩 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
