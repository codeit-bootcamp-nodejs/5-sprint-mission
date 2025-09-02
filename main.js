import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct
} from './services/ProductService.js';

import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle
} from './services/ArticleService.js';

// 상품 클래스
class Product {
  constructor({ name, description, price, tags = [], images = [], favoriteCount = 0 }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }
  favorite() { this.favoriteCount += 1; }
}

// 전자제품 클래스 (상속 + manufacturer)
class ElectronicProduct extends Product {
  constructor({ manufacturer = '', ...rest }) {
    super(rest);
    this.manufacturer = manufacturer;
  }
}

// 게시글 클래스 (createdAt 포함)
class Article {
  constructor({ title, content, writer, likeCount = 0 }) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date();
  }
  like() { this.likeCount += 1; }
}

// "전자제품" 태그면 ElectronicProduct, 아니면 Product
function toProductInstance(dto) {
  const tags = Array.isArray(dto.tags) ? dto.tags : [];
  return tags.includes('전자제품') ? new ElectronicProduct(dto) : new Product(dto);
}

const products = [];

async function run() {
  // Article: then/catch 방식
  getArticleList({ page: 1, pageSize: 5, keyword: '' })
    .then((res) => {
      console.log('Article list:', res);
      const firstId = res?.list?.[0]?.id;
      if (firstId) return getArticle(firstId);
    })
    .then((detail) => {
      if (detail) console.log('Article detail:', detail);
      return createArticle({
        title: '테스트 제목',
        content: '테스트 내용입니다',
        image: 'https://example.com/img.png',
      });
    })
    .then((created) => {
      console.log('Article created:', created);
      return patchArticle(created.id, { title: '수정된 제목' }).then(() => created.id);
    })
    .then((idToDelete) => deleteArticle(idToDelete))
    .then((deleted) => {
      console.log('Article deleted:', deleted);
    })
    .catch((e) => {
      console.error('Article flow error:', e);
    });

  // Product: async/await 방식
  try {
    // 목록 → 인스턴스 배열 저장
    const listRes = await getProductList({ page: 1, pageSize: 10, keyword: '' });
    (listRes.list || []).forEach((dto) => products.push(toProductInstance(dto)));
    console.log('Product instances:', products);

    // 상세/생성/수정/삭제 호출 예시 (요구사항 확인용)
    if (products[0]?.id) {
      const detail = await getProduct(products[0].id);
      console.log('Product detail:', detail);
    }

    const created = await createProduct({
      name: '샘플 상품',
      description: '설명입니다',
      price: 9900,
      tags: ['전자제품'],
      images: ['https://example.com/a.png'],
    });
    console.log('Product created:', created);

    const patched = await patchProduct(created.id, { price: 10900 });
    console.log('Product patched:', patched);

    const deleted = await deleteProduct(created.id);
    console.log('Product deleted:', deleted);
  } catch (err) {
    console.error('Product flow error:', err);
  }

  // 메서드 동작 확인
  const p = new Product({ name: '일반', description: 'desc', price: 1000 });
  p.favorite();

  const e = new ElectronicProduct({ name: '전자', description: 'desc', price: 2000, tags: ['전자제품'] });
  e.favorite();

  const a = new Article({ title: '제목', content: '내용', writer: '작성자' });
  a.like();

  console.log('Checks:', {
    pFav: p.favoriteCount,
    eFav: e.favoriteCount,
    aLike: a.likeCount,
    aCreatedAt: a.createdAt,
  });
}

run();
