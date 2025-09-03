import {
  Article,
  getArticleList,
  getArticle,
  createArticle,
  deleteArticle,
  patchArticle,
} from "./ArticleService.js";
import {
  Product,
  ElectronicProduct,
  getProductList,
  getProduct,
  createProduct,
  deleteProduct,
  patchProduct,
} from "./ProductService.js";

async function testProduct() {
  let products = [];
  const productListData = await getProductList({
    page: 19,
    pageSize: 5,
    keyword: "전자제품",
  });
  productListData.list.forEach((product) => {
    console.log(product.id);
  });

  productListData.list.forEach((product) => {
    if (product.name.includes("전자제품")) {
      const electronicProduct = new ElectronicProduct(
        product.name,
        product.description,
        product.price,
        product.tags,
        product.images,
        "삼성전자"
      );
      products.push(electronicProduct);
      console.log("전자제품 생성");
    } else {
      const generalProduct = new Product(
        product.name,
        product.description,
        product.price,
        product.tags,
        product.images
      );
      products.push(generalProduct);
      console.log("그냥 상품 생성");
    }
  });

  console.log(await getProduct(1509));

  const bodyData = {
    name: "check product. 전자제품",
    description: "테스트용 상품입니다.",
    price: "priceless",
    tags: ["priceless", "Yeah"],
    iamges: ["https://example.com/..."],
  };

  const bodyData1 = {
    name: "changed product. 전자제품",
    description: "바꿔버리기~",
    price: "priceless",
    tags: ["priceless", "Yeah"],
    iamges: ["https://example.com/..."],
  };

  console.log(await createProduct(bodyData));
  console.log(await patchProduct(1085, bodyData1));
  console.log(await deleteProduct(1085));
}
testProduct();
