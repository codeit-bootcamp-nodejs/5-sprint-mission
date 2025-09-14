import { PrismaClientKnownRequestError, skip } from "@prisma/client/runtime/library";
import { Exception } from "../common/exception.js";
import { ProductMapper } from "./mapper/product.mapper.js";

export class ProductRepo{
  #prisma;
  #includesOptions;
  constructor(prisma) {
    this.#prisma = prisma;
    // this.#includesOptions = {
    //   : true,
    // };
  }

  findProductByname = async (name) => {
    const product = await this.#prisma.product.findUnique({
      where: {name}, 
    });
    return product ? ProductMapper.toEntity(product) : null;
  }

  findProductById = async (id) => {
    const product = await this.#prisma.product.findUnique({
      where: {id}, 
    });
    return product ? ProductMapper.toEntity(product) : null;
  }
  findProductList = async ({offset, limit, orderBy}) => {
    const productList = await this.#prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy,
    });

    return productList.map(product => ProductMapper.toEntity(product));
  }
  
  /***
   * create시 DB에서 발생할 수 있는 대표적인 에러 2개 만들어 봄
   */
  create = async (entity) => {
    let product
    try{
      product = await this.#prisma.product.create({
        data: {
          ...ProductMapper.toPersistent(entity),
        }
      });
    } catch(err){
      if(err instanceof PrismaClientKnownRequestError){
        if(err.code === P2002){
          if(err.meta?.target === 'name'){
            throw new Exception("NAME_DUPLICATE");
          }
        } else if(err.code === P2003){
          throw new Exception("FOREIGN_KEY_VIOLATION");
        }
      }
      throw err;
    }
    return ProductMapper.toEntity(product);
  };

  update = async (entity) => {
    const updatedproduct = await this.#prisma.product.update({
      where : {id: entity.id},
      data: {
        ...ProductMapper.toPersistent(entity),
        updatedAt: new Date(),
      }
    });

    return ProductMapper.toEntity(updatedproduct);
  }

  delete = async (entity) => {
    const deletedProduct = await this.#prisma.product.delete({
      where : entity.id
        ? {id: entity.id}
        : {name: entity.name}
    });
    return deletedProduct;
  }
}