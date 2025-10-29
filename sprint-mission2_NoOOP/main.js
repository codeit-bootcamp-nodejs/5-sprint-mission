import ArticleDTO from "./dto/article-dto.js";
import ProductDTO from "./dto/product-dto.js";

import ArticleService from "./service/ArticleService.js";
import ProductService from "./service/ProductService.js";

import Article from "./entity/article.js";
import Product from "./entity/product.js";
import ElectronicProduct from "./entity/electronic-product.js";

// [!] 각 API 호출 예제는 로직과 출력으로 나눠서 코드 형식을 맞췄습니다 :)
const PAGE = 1;
const itemCnt = 10;

const articleService = new ArticleService();
const productService = new ProductService();

console.log("========== ARTICLE API ========== ");

const articles = []; // <--- 로직
let response = await articleService.getArticleList(PAGE, itemCnt);
for (const item of response) {
  const article = new Article(item.title, item.content, item.id);
  articles.push(article);
}

console.log("\n======== [GET] getArticleList() : 페이지 단위로 글 조회====="); // <-- 출력
console.log(response);
for (const article of articles) {
  article.showInfo();
}

let image = "https://example.com/...";
let title = "new title";
let content = "new content";
const newArticle1 = new ArticleDTO(image, content, title);
response = await articleService.createArticle(newArticle1);
const createdArticle = new Article(
  response.title,
  response.content,
  response.id,
);

console.log("\n======== [POST] createArticle() : 글 작성 =====");
console.log(response);
createdArticle.showInfo();

response = await articleService.getArticle(createdArticle.writer);
let article = new Article(response.title, response.content, response.writer);

console.log(
  "\n======== [GET] getArticle() : 글 ID로 조회 (작성한 글 조회) =====",
);
console.log(response);
article.showInfo();

let imgURL = "http://example.com";
content = "updated content";
title = "updated title";
const newArticle2 = new ArticleDTO(imgURL, content, title);
response = await articleService.patchArticle(
  createdArticle.writer,
  newArticle2,
);
const updatedArticle = new Article(
  response.title,
  response.content,
  response.id,
);

console.log(
  "\n======== [PATCH] patchArticle() : 글 수정 (작성한 글 수정) =====",
);
console.log(response);
updatedArticle.showInfo();

response = await articleService.deleteArticle(updatedArticle.writer);

console.log(
  "\n======== [DELETE] deleteArticle() : 글 삭제 (수정한 글 삭제) =====",
);
console.log(response);

// ==============================================================================

console.log("\n\n\n\n========== PRODUCT API ========== ");
const products = [];
response = await productService.getProductList(PAGE, itemCnt);
for (const item of response) {
  let product = null;

  if (item.tags.includes("전자제품")) {
    product = new ElectronicProduct(
      item.name,
      item.description,
      item.price,
      item.tags,
      item.images,
    );
  } else {
    product = new Product(
      item.name,
      item.description,
      item.price,
      item.tags,
      item.images,
    );
  }

  products.push(product);
}

console.log(
  "\n======== [GET] getProductList()  : 페이지 단위로 상품 조회 =====",
);
console.log(response);
for (const product of products) {
  product.showInfo();
}

let images = ["https://example.com"];
let tags = ["전자기기"];
let price = 500000;
let description = "게임기";
let name = "닌텐도 스위치";
const newProduct1 = new ProductDTO(images, tags, price, description, name);
response = await productService.createProduct(newProduct1);
const createdProduct = new Product(
  response.name,
  response.description,
  response.price,
  response.tags,
  response.images,
);

console.log("\n======== [POST] createProduct() : 새로운 상품 등록 =====");
console.log(response);
createdProduct.showInfo();

response = await productService.getProduct(response.id);
let product = new Product(
  response.name,
  response.description,
  response.price,
  response.tags,
  response.images,
);

console.log("\n======== [GET] getProduct() : productId로 상품조회 =====");
console.log(response);
product.showInfo();

images = ["https://example.com"];
tags = ["전자기기"];
price = 1000000;
description = "노트북";
name = "MSI GS Stealth66";
const newProduct2 = new ProductDTO(images, tags, price, description, name);
response = await productService.patchProduct(response.id, newProduct2);
let updatedProduct = new Product(
  response.name,
  response.description,
  response.price,
  response.tags,
  response.images,
);

console.log(
  "\n======== [PATCH] getProduct() : productId에 해당하는 상품 수정 =====",
);
console.log(response);
updatedProduct.showInfo();

console.log(
  "\n======== [DELETE] deleteProduct() : productId로 해당 상품 제거 =====",
);
response = await productService.deleteProduct(response.id);
console.log(response);
