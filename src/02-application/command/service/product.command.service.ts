import { NotificationType } from "@prisma/client";
import { ProductDto } from "../../../01-inbound/request/product.request";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ProductResDto } from "../../../01-inbound/response/product.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../../shared/exception/exception";
import { INotificationCommandRepository } from "../../port/repositories/command/I.notification.repository";
import { IProductLikeCommandRepository } from "../../port/repositories/command/I.product.like.repository";
import { IProductCommandRepository } from "../../port/repositories/command/I.product.repository";
import { Product, PersistedProduct } from "../entity/product";
import { Notification } from "../entity/notification";

export const createProductCommandService = (
  productCommandRepository: IProductCommandRepository,
  productLikeCommandRepository: IProductLikeCommandRepository,
  notificationCommandRepository: INotificationCommandRepository,
  notificationEventBus: INotificationEventBus,
) => {
  const createProduct = async (dto: ProductDto) => {
    // 상품 생성
    const productEntity = Product.createNew(dto);
    const newProduct = await productCommandRepository.save(productEntity);

    // 알림 이벤트 생성
    const notifcationEntity = Notification.createNew({
      type: NotificationType.NEW_PRODUCT,
      message: `새로운 상품이 등록되었습니다!`,
      read: false,
      senderId: newProduct.userId,
    });
    const notification =
      await notificationCommandRepository.create(notifcationEntity);
    notificationEventBus.publishAll(notification);
    return ProductResDto(newProduct);
  };

  const updateProduct = async (dto: ProductDto) => {
    const { id, userId, ...data } = dto;
    if (!id) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL,
      });
    }

    // 기존 상품 조회
    const foundProduct = await productCommandRepository.findById(id);
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
    const updatedProduct = await productCommandRepository.update(
      foundProduct,
      newProduct,
    );

    // 상품 좋아요를 누른 유저 조회
    const productLikes = await productLikeCommandRepository.findAll(id);

    // (좋아요를 누른 모든 유저에게) 가격 변경 알림 전송
    if (productLikes && foundProduct.price !== updatedProduct.price) {
      await Promise.all(
        // 비동기 실패 누락 처리
        productLikes
          .filter((like) => like.userId !== foundProduct.userId)
          .map(async (like) => {
            // 알림 DB에 저장
            const notifcationEntity = Notification.createNew({
              type: NotificationType.PRODUCT_PRICE_CHANGE,
              message: `가격이 변동되었습니다. (${foundProduct.price} -> ${updatedProduct.price})`,
              read: false,
              senderId: userId,
              receiverId: like.userId,
            });
            const notification =
              await notificationCommandRepository.create(notifcationEntity);

            // 알림 이벤트 생성
            notificationEventBus.publish(notification);
          }),
      );
    }
    return ProductResDto(updatedProduct);
  };

  const deleteProduct = async (id: string, userId: string) => {
    // 기존 상품 조회
    const product = await productCommandRepository.findById(id);
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
    await productCommandRepository.removeById(id);
  };

  const likeProduct = async (userId: string, productId: string) => {
    // 상품 조회
    const product = await productCommandRepository.findById(productId);
    if (!product) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    // 상품 좋아요
    const productLike = await productLikeCommandRepository.toggle(
      userId,
      productId,
    );

    // 좋아요 알림 생성 (자신의 상품이 아닐 때만 알림)
    if (productLike && productLike.userId !== product.userId) {
      const notifcationEntity = Notification.createNew({
        type: NotificationType.PRODUCT_LIKE,
        message: `${userId}님이 좋아요를 눌렀습니다!`,
        read: false,
        senderId: userId,
        receiverId: product.userId,
      });

      const notification =
        await notificationCommandRepository.create(notifcationEntity);

      // 알림 이벤트 생성
      notificationEventBus.publish(notification);
      return true;
    } else {
      return false;
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    likeProduct,
  };
};

export type ProductCommandServiceType = ReturnType<
  typeof createProductCommandService
>;
