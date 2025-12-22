import { NotificationType } from "@prisma/client";
import { ProductDto } from "../../../01-inbound/request/product.request";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ProductResDto } from "../../../01-inbound/response/product.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { INotificationCommandRepository } from "../../port/repositories/command/I.notification.repository";
import { IProductLikeCommandRepository } from "../../port/repositories/command/I.product.like.repository";
import { IProductCommandRepository } from "../../port/repositories/command/I.product.repository";
import { PersistedProduct, Product } from "../../command/entity/product";
import { Notification } from "../../command/entity/notification";
import { IProductQueryRepository } from "../../port/repositories/query/I.product.query.repository";
import { IRedisExternal } from "../../port/externals/I.redis.external";
import { ProductView } from "../view/product.view";



export const createProductQueryService = (
  redisExternal: IRedisExternal,
  productQueryRepository: IProductQueryRepository,
) => {

  const getAllProducts = async (query: QueryType) => {
    const products = await productQueryRepository.findAll(query);
    return products;
  };

  const getProduct = async (id: string) => {
    const key = `product:${id}`;
    let product: ProductView | null = null;
    let lock = null;

    // Redis에서 조회
    const cachedProduct = await redisExternal.get(key);
    if (cachedProduct) {
      product = JSON.parse(cachedProduct);
    } else {
      for (let i = 0; i < 5; i++) {
        if (lock) {
          lock = await redisExternal.setIfNotExist(
            `lock:product:${id}`,
            ".",
            10
          );

          const foundProduct = await productQueryRepository.findById(id);
          await redisExternal.set(
            key,
            JSON.stringify(foundProduct)
          );
          product = foundProduct;
          await redisExternal.remove(`lock:product:${id}`);
        } else {
          const cachedProduct = await redisExternal.get(key);
          if (cachedProduct) {
            product = JSON.parse(cachedProduct);
            break;
          }
          console.log(`상품 조회 재시도 ${i}`);
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
        }

        await redisExternal.remove(`lock:product:${id}`);
      }

      if (!product) {
        throw new Error("상품 조회 실패");
      }
    }

    return product;
  };


  return {
    getAllProducts,
    getProduct,

  };
}



export type ProductQueryServiceType = ReturnType<typeof createProductQueryService>;
