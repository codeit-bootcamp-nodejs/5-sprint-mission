import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from "./Service/ArticleService.js";
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct, makeElectronicClass, makeProductClass } from "./Service/ProductService.js";

console.log('전자제품',await makeElectronicClass());
console.log('일반제품', await makeProductClass());

getArticleList()
  .then(data => {
    console.log("\n▶︎ 게시글 목록을 불러옵니다.", data);
  })
  .catch(e => {
    console.error(e.message);
  }
)

getArticle(4058)
  .then(data => {
    console.log("\n▶︎ 게시글 상세 조회", data);
  })
  .catch(e => {
    console.error(e.message);
  }
)

createArticle ({
  title:'테스트중입니다',
  content:'내용을 입력하세요',
  image:'https://photos'
} )
  .then(data => {
    console.log("\n▶︎ 새로운 글을 게시합니다.", data);
  })
  .catch(e => {
    console.error(e.message);
  }
)

patchArticle(4058)
  .then(data => {
    console.log("\n▶︎ 게시글 수정", data);
  })
  .catch(e => {
    console.error(e.message);
  }
)

deleteArticle(0)
  .then(data => {
    console.log("\n▶︎ 게시글 삭제", data);
  })
  .catch(e => {
    console.error(e.message);
  }
)


  
getProductList()
  .then(data => {
    console.log("\n▶︎ 상품 목록을 불러옵니다.", data)
  })
  .catch(e => {
    if (e.response){
    console.log(e.response.status, e.response.data);
  } else if (e.request) {
    console.error(e.request);
  } else {
    console.error(e.message);
  }}
)

getProduct(1744)
  .then(data => {
    console.log("\n▶︎ 상품 상세정보.", data)
  })
  .catch(e => {
    if (e.response){
    console.log(e.response.status, e.response.data);
  } else if (e.request) {
    console.error(e.request);
  } else {
    console.error(e.message);
  }}
)

createProduct({
    name:'상품명',
    description :'상품 설명',
    price: '10000',
    tags:'전자제품',
    images:'https://example.com'
  }) 
  .then(data => {
  console.log('\n ▶︎ 새 상품 등록', data);   
 })
  .catch(e => {
    if (e.response){
    console.log(e.response.status, e.response.data);
  } else if (e.request) {
    console.error(e.request);
  } else {
    console.error(e.message);
  }}
)

patchProduct(1744)
  .then(data => {
  console.log('\n ▶︎ 상품 정보를 수정', data);   
 })
  .catch(e => {
    if (e.response){
    console.log(e.response.status, e.response.data);
  } else if (e.request) {
    console.error(e.request);
  } else {
    console.error(e.message);
  }}
)

deleteProduct(0)
  .then(data => {
  console.log('\n ▶︎ 상품 정보를 수정', data);   
 })
  .catch(e => {
    if (e.response){
    console.log(e.response.status, e.response.data);
  } else if (e.request) {
    console.error(e.request);
  } else {
    console.error(e.message);
  }}
  )


