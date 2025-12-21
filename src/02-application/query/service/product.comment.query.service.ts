import { ProductCommentDto } from "../../../01-inbound/request/product.comment.request";
import { ProductCommentResDto } from "../../../01-inbound/response/product.comment.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { ProductComment } from "../../command/entity/product.comment.entity";
import { IProductCommentQueryRepository } from "../../port/repositories/query/I.product.comment.query.repository";



export const createProductCommentQueryService = (
  productCommentQueryRepository: IProductCommentQueryRepository,
  notificationEventBuses: INotificationEventBus
) => {


  const getProductComments = async (productId: string) => {
    const productComments = await productCommentQueryRepository.findAll(productId);
    return productComments;
  };

  return {
    getProductComments
  };
};

export type ProductCommentQueryServiceType = ReturnType<
  typeof createProductCommentQueryService
>;
