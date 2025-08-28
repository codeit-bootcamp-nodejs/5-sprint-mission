  // 프러덕트서비스에서 받아오기
  import {
    getProductList,
    getProduct,
    createProduct,
    patchProduct,
    deleteProduct,
  } from './ProductService.js';
  
  // 아티클서비스에서 받아오기
  import {
    getArticleList,
    getArticle,
    createArticle,
    patchArticle,
    deleteArticle,
  } from './ArticleService.js';
  
  
  // 프로덕트 클래스
  class Product {

  //생성자
  constructor(name, description, price, tags = [], images = [],favoriteCount = 0){
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = tags;
    this._images = images;
    this._favoriteCount = favoriteCount
  }
  //메소드
  favorite() {
    this._favoriteCount++;
  }

  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get price() {
    return this._price;
  }
  get tags() {
    return this._tags;
  }
  get images() {
    return this._images;
  }
  get favoriteCount() {
    return this._favoriteCount;
  }
}

// 일렉트로닉프로덕트 클래스
class ElectronicProduct extends Product{

  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }
  get manufacturer() {
    return this._manufacturer;
  }
}



//아티클 클래스 
class Article {
 
  constructor(title, content, writer, likeCount = 0) {
    this._title = title;
    this._content = content;
    this._writer = writer;
    this._likeCount = likeCount;
    this._createdAt = new Date().toISOString();
  }

  like() {
    this._likeCount++;
  }
  get title() {
    return this._title;
  }
  get content() {
    return this._content;
  }
  get writer() {
    return this._writer;
  }
  get likeCount() {
    return this._likeCount;
  }
  get createdAt() {
    return this._createdAt;
  }
}
// getProductList배열을 통해 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장하기
// 태그에 "전자제품" 포함시 Product 클래스 대신 ElectronicProduct에 인스턴스 생성. 나머진 그냥 Product에 넣기

const products = [];

async function listProductToInstance() {
  const list = await getProductList(1, 5, "");
  if(!list) return;

  const items = list.list;
  products.length = 0;

  items.forEach(item => {
    const{name, description, price, tags = [], images = [], manufacturer} = item;
    if(tags.includes("전자제품")) {
      products.push(new ElectronicProduct(name, description, price, tags, images, 0, "제조사 미정"));
    } else {
      products.push(new Product(name, description, price, tags, images));
    }
  });

  console.log("인스턴스화 완료:", JSON.stringify(products, null, 2));

}




// 테스트 실행 코드
(async () => {
  console.log("===== Product 클래스 =====");

  // 1) 리스트 → 인스턴스화

  const products = [];
  const list = await getProductList(2, 4, "");
  if (list && list.list) {
    list.list.forEach(item => {
      const { name, description, price, tags = [], images = [], manufacturer } = item;
      if (tags.includes("전자제품")) {
        products.push(new ElectronicProduct(name, description, price, tags, images, 0, manufacturer || "제조사 미정" ));
      } else {
        products.push(new Product(name, description, price, tags, images));
      }
    });
  }
  console.log("인스턴스화 완료:", products);

  // 2) 상품 생성
  const newProduct = await createProduct({
    name: "물통",
    description: "보온 굿",
    price: 9999,
    tags: ["물통", "테스트"],
    images: ["https://via.placeholder.com/150"],
  });
  console.log("상품 생성:", newProduct);

  // 3) 상품 조회
  if (newProduct?.id) {
    const fetchedProduct = await getProduct(newProduct.id);
    console.log("특정 상품 조회:", fetchedProduct);

    // 4) 상품 수정
    const updated = await patchProduct(newProduct.id, { description: "사실 보온안됨 ㅎ" });
    console.log("상품 수정:", updated);

    // 5) 상품 삭제
    const deleted = await deleteProduct(newProduct.id);
    console.log("상품 삭제:", deleted);
  }

  console.log("===== Article 테스트 =====");

  // 1) 글 목록
  const articleList = await getArticleList(1, 2, "테스트");
  console.log("글 목록:", articleList);

  // 2) 글 생성
  const newArticle = await createArticle({
    title: "지혜",
    content: "통합 테스트용 글입니다",
    image: "https://via.placeholder.com/200",
  });
  console.log("글 생성:", newArticle);

  // 3) 글 조회
  if (newArticle?.id) {
    const fetchedArticle = await getArticle(newArticle.id);
    console.log("특정 글 조회:", fetchedArticle);

    // 4) 글 수정
    const updatedArticle = await patchArticle(newArticle.id, { content: "삐용" });
    console.log("글 수정:", updatedArticle);

    // 5) 글 삭제
    const deletedArticle = await deleteArticle(newArticle.id);
    console.log("글 삭제:", deletedArticle);
  }

  console.log("===== 통합 테스트 완료 =====");
})();

 

  
 