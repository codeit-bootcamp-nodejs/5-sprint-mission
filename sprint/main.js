import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from "./Service/ArticleService.js";
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct, makeElectronicClass, makeProductClass } from "./Service/ProductService.js";

getArticleList()
  .then(data => data)
  .catch(e => {
    throw e;       
  });

getArticle(4058)
  .then(data => data)
  .catch(e => {
    throw e;       
  });

createArticle ({
  title:'테스트중입니다',
  content:'내용을 입력하세요',
  image:'https://photos'
} )
  .then(data => data)
  .catch(e => {
    throw e;       
  });

patchArticle(4058)
  .then(data => data)
  .catch(e => {
    throw e;       
  });

deleteArticle(0)
  .then(data => data)
  .catch(e => {
    throw e;       
  });



getProductList()
  .then(data => data)
  .catch(e => {
    if (e.response){
      return e.response.data;
    } else if (e.request) {
      throw e.request;
    } else {
      throw e.message;
    }
  });

getProduct(1744)
  .then(data => data)
  .catch(e => {
    if (e.response){
      return e.response.data;
    } else if (e.request) {
      throw e.request;
    } else {
      throw e.message;
    }
  });

createProduct({
    name:'상품명',
    description :'상품 설명',
    price: '10000',
    tags:'전자제품',
    images:'https://example.com'
  }) 
  .then(data => data)
  .catch(e => {
    if (e.response){
      return e.response.data;
    } else if (e.request) {
      throw e.request;
    } else {
      throw e.message;
    }
  });

patchProduct(1744)
  .then(data => data)
  .catch(e => {
    if (e.response){
      return e.response.data;
    } else if (e.request) {
      throw e.request;
    } else {
      throw e.message;
    }
  });

deleteProduct(0)
  .then(data => data)
  .catch(e => {
    if (e.response){
      return e.response.data;
    } else if (e.request) {
      throw e.request;
    } else {
      throw e.message;
    }
  });


  
await makeElectronicClass();
await makeProductClass();


