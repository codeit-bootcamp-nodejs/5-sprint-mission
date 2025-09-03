  import {
    getProductList,
    getProduct,
    createProduct,
    patchProduct,
    deleteProduct,
  } from './ProductService.js';
  
  import {
    getArticleList,
    getArticle,
    createArticle,
    patchArticle,
    deleteArticle,
  } from './ArticleService.js';
  
  
  class Product {

  constructor(name, description, price, tags = [], images = [],favoriteCount = 0){
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = tags;
    this._images = images;
    this._favoriteCount = favoriteCount
  }
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

class ElectronicProduct extends Product{

  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }
  get manufacturer() {
    return this._manufacturer;
  }
}


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
}




