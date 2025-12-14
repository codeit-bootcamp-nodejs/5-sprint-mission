import { NotificationType } from "@prisma/client";
import { IEventBus } from "../../01-inbound/port/I.eventbus";
import { ProductDto } from "../../01-inbound/request/product.request";
import { ProductResDto } from "../../01-inbound/response/product.response";
import { Notification } from "../entity/notification";
import { PersistedProduct, Product } from "../entity/product";
import { IBaseRepository } from "../port/I.base.repository";
import { QueryType } from "../../01-inbound/request/query.request";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";

export const createProductService = (
  repos: IBaseRepository,
  eventBus: IEventBus,
) => {
  const createProduct = async (dto: ProductDto) => {
    const productEntity = Product.createNew(dto);
    const newProduct = await repos.product.save(productEntity);
    return ProductResDto(newProduct);
  };

  const getAllProducts = async (query: QueryType) => {
    const productEntities = await repos.product.findAll(query);
    const productDtos = productEntities.map((entity: PersistedProduct) =>
      ProductResDto(entity),
    );
    return productDtos;
  };

  const getProduct = async (id: string) => {
    const productEntity = await repos.product.findById(id);
    return ProductResDto(productEntity);
  };

  const updateProduct = async (dto: ProductDto) => {
    const { id, userId, ...data } = dto;
    if (!id) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL,
      });
    }

    // 기존 상품 조회
    const foundProduct = await repos.product.findById(id);
    if (!foundProduct) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    if (foundProduct.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    const newProduct = Product.createNew({
      ...data,
      userId,
    });

    //  상품 수정
    const updatedProduct = await repos.product.update(foundProduct, newProduct);

    // 상품 좋아요를 누른 유저 조회
    const productLikes = await repos.productLike.findAll(id);

    // (좋아요를 누른 모든 유저에게) 가격 변경 알림 전송
    if (productLikes && foundProduct.price !== updatedProduct.price) {
      productLikes.map(async (productLike) => {
        if (productLike.userId !== foundProduct.userId) {
          const notificationEntity = Notification.createNew({
            type: NotificationType.PRODUCT_PRICE_CHANGE,
            message: `내가 좋아요한 상품 가격이 변동했습니다. (${foundProduct.price} => ${updatedProduct.price})`,
            read: false,
            senderId: userId,
            receiverId: productLike.userId,
          });
          const notification =
            await repos.notification.create(notificationEntity);
          eventBus.notification.publish(notification);
        }
      });
    }
    return ProductResDto(updatedProduct);
  };

  const deleteProduct = async (id: string, userId: string) => {
    // 기존 상품 조회
    const product = await repos.product.findById(id);
    if (!product) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }
    if (product.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    // 상품 삭제
    await repos.product.removeById(id);
  };

  const likeProduct = async (userId: string, productId: string) => {
    // 상품 조회
    const product = await repos.product.findById(productId);
    if (!product) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    // 상품 좋아요
    const productLike = await repos.productLike.toggle(userId, productId);

    // 좋아요 알림 생성 (자신의 상품이 아닐 때만 알림)
    if (productLike && productLike.userId !== product.userId) {
      const notificationEntity = Notification.createNew({
        type: NotificationType.PRODUCT_LIKE,
        message: `${userId}님이 좋아요를 눌렀습니다!`,
        read: false,
        senderId: userId,
        receiverId: product.userId,
      });
      eventBus.notification.publish(notificationEntity);
      return true;
    } else {
      return false;
    }
  };

  return {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    likeProduct,
  };
};

export type ProductServiceType = ReturnType<typeof createProductService>;
