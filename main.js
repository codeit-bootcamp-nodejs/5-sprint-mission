import Article from "./Models/Article.js";
import Product from "./Models/Product.js";
import ElectronicProduct from "./Models/ElectronicProduct.js";

import { 
  getArticleList, getArticle, createArticle, patchArticle, deleteArticle 
} from "./Services/ArticleService.js";

import { 
  getProductList, getProduct, createProduct, patchProduct, deleteProduct 
} from "./Services/ProductService.js";

(async () => {
  console.log("===== Article 테스트 =====");

  // Article 목록 조회
  const articleDataList = await getArticleList(1, 5, "");
  console.log("API 응답 확인 (Article): 게시글 목록", articleDataList);

  // 배열이 아닌 경우 빈 배열 처리
  const articleArray = Array.isArray(articleDataList) ? articleDataList : (articleDataList.data || []);
  
  // 클래스 인스턴스로 변환
  const articles = articleArray.map(a => 
    new Article(a.title, a.content, a.writer, a.likeCount, a.createdAt)
  );
  console.log("Article 인스턴스 목록:", articles);

  // Article 좋아요 테스트
  if (articles.length > 0) {
    articles[0].like();
    console.log("첫 번째 Article 좋아요 후:", articles[0]);
  }

  // 생성 후 인스턴스 생성
  const createdArticleData = await createArticle(
    "첫번째 글", 
    "내용", 
    "https://picsum.photos/200"
  );
  const newArticle = new Article(
    createdArticleData.title, 
    createdArticleData.content, 
    createdArticleData.writer, 
    createdArticleData.likeCount,
    createdArticleData.createdAt
  );
  console.log("생성된 Article 인스턴스:", newArticle);

  console.log("===== Product 테스트 =====");

  // Product 목록 조회
  const productDataList = await getProductList(1, 5, "");
  console.log("API 응답 확인 (Product):", productDataList);

  // 배열이 아닌 경우 빈 배열 처리
  const productArray = Array.isArray(productDataList) ? productDataList : (productDataList.data || []);

  // ElectronicProduct 클래스 인스턴스로 변환
  const products = productArray.map(p => {
    if (p.tags && p.tags.includes("전자제품")) {
      return new ElectronicProduct(
        p.name,
        p.description,
        p.price,
        p.tags,
        p.images,
        p.favoriteCount,
        p.manufacturer
      );
    } else {
      return new Product(
        p.name,
        p.description,
        p.price,
        p.tags,
        p.images,
        p.favoriteCount
      );
    }
  });
  console.log("인스턴스 목록:", products);

  // 상품 찜하기 테스트
  if (products.length > 0) {
    products[0].favorite();
    console.log("첫 번째 상품 찜하기 후:", products[0]);
  }

  // Product 생성 후 인스턴스 생성
  const createdProductData = await createProduct({
    name: "노트북",
    description: "최신 노트북입니다",
    price: 3000000,
    tags: ["전자제품", "추천"],
    images: ["https://via.placeholder.com/150"]
  });

  let newProductInstance;
  if (createdProductData.tags && createdProductData.tags.includes("전자제품")) {
    newProductInstance = new ElectronicProduct(
      createdProductData.name,
      createdProductData.description,
      createdProductData.price,
      createdProductData.tags,
      createdProductData.images,
      createdProductData.favoriteCount,
      createdProductData.manufacturer
    );
  } else {
    newProductInstance = new Product(
      createdProductData.name,
      createdProductData.description,
      createdProductData.price,
      createdProductData.tags,
      createdProductData.images,
      createdProductData.favoriteCount
    );
  }

  console.log("생성된 인스턴스:", newProductInstance);

})();
