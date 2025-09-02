import { getProductList } from "./ProductService.js";
import Product from "./product.js";
import ElectronicProduct from "./electronic_product.js";

async function main() {
  const data = await getProductList();

  const products = data.list.map((item) =>
    item.tags?.includes("전자제품")
      ? new ElectronicProduct(item.manufacturer, item.name, item.description, item.price, item.tags, item.images)
      : new Product(item.name, item.description, item.price, item.tags, item.images)
  );

  console.log(products);
}

main();