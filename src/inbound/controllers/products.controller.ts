import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../../common/lib/prisma.client";
import { IdParamsStruct } from "../../common/validation/common.structs";
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../../common/validation/products.struct";
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from "../../common/validation/comments.struct";
import { attachIsLiked } from "../../common/lib/isliked.util";
import {
  AuthenticatedHandler,
  ExpressHandler,
} from "../../common/types/common";
import { notifyPriceChange } from "../../domain/services/price.change.notification.service";
import { notifyCommentOnProduct } from "../../domain/services/comment.notification.service";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";

export const createProduct: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, description, price, tags, images } = create(
    req.body,
    CreateProductBodyStruct,
  );
  const userId = req.user?.userId;
  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 상품을 등록할 수 있습니다." });
    return;
  }
  const product = await prismaClient.product.create({
    data: { name, description, price, tags, images, userId },
  });
  res.status(201).send(product);
};

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    throw new BusinessException({
      type: BusinessExceptionType.PRODUCT_NOT_FOUND,
    });
  }

  const [productWithLiked] = await attachIsLiked([product], userId, "product");
  res.send(productWithLiked);
}

export const updateProduct: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(
    req.body,
    UpdateProductBodyStruct,
  );
  const userId = req.user?.userId;
  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new BusinessException({
      type: BusinessExceptionType.PRODUCT_NOT_FOUND,
    });
  }
  if (existingProduct.userId !== userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }
  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  if (existingProduct.price !== updatedProduct.price && userId) {
    await notifyPriceChange(
      id,
      userId,
      existingProduct.price,
      updatedProduct.price,
    );
  }

  const response = {
    createdAt: updatedProduct.createdAt,
    images: updatedProduct.images,
    tags: updatedProduct.tags,
    price: updatedProduct.price,
    description: updatedProduct.description,
    name: updatedProduct.name,
    id: updatedProduct.id,
  };
  res.send(response);
};

export async function deleteProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new BusinessException({
      type: BusinessExceptionType.PRODUCT_NOT_FOUND,
    });
  }
  if (existingProduct.userId !== userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }
  await prismaClient.product.delete({ where: { id } });
  res.send({ id });
}

export async function getProductList(
  req: Request,
  res: Response,
): Promise<void> {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetProductListParamsStruct,
  );
  const userId = req.user?.userId;

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy:
      orderBy === "recent" ? { createdAt: "desc" } : { createdAt: "asc" },
    where,
  });

  const productsWithIsLiked = await attachIsLiked(products, userId, "product");

  res.send({
    list: productsWithIsLiked,
    totalCount,
  });
}

export async function createComment(
  req: Request,
  res: Response,
): Promise<void> {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const userId = req.user?.userId;

  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 댓글을 작성할 수 있습니다." });
    return;
  }

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    throw new BusinessException({
      type: BusinessExceptionType.PRODUCT_NOT_FOUND,
    });
  }

  const comment = await prismaClient.comment.create({
    data: { productId, content, userId },
  });

  await notifyCommentOnProduct(productId, userId, existingProduct.name);

  res.status(201).send(comment);
}

export async function getCommentList(
  req: Request,
  res: Response,
): Promise<void> {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    throw new BusinessException({
      type: BusinessExceptionType.PRODUCT_NOT_FOUND,
    });
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[limit];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
}
