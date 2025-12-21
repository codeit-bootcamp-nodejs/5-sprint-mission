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



export const createProductQueryService = (
  productQueryRepository: IProductQueryRepository,
) => {

  const getAllProducts = async (query: QueryType) => {
    const products = await productQueryRepository.findAll(query);
    return products;
  };

  const getProduct = async (id: string) => {
    const product = await productQueryRepository.findById(id);
    return product;
  };


  return {
    getAllProducts,
    getProduct,

  };
}



export type ProductQueryServiceType = ReturnType<typeof createProductQueryService>;
