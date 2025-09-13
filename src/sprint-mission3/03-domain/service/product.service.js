import { Exception } from "../../common/exception.js";
import { Product } from "../entity/product.js";

export class ProductService{
  #productRepo;

  constructor(productRepo) {
    this.#productRepo = productRepo;
  }

  createProduct = async ({name, description, price, tags}) => {
    const findProduct = await this.#productRepo.findProductByname(name);
    if(findProduct){
      throw new Exception("NAME_ALREADY_EXIST");
    }
    const product = Product.createFactory({name, description, price, tags});
    
    const createdProduct = await this.#productRepo.create(product);
    
    return createdProduct;
  }
}