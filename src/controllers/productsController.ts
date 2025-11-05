import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient";
import NotFoundError from "../lib/errors/NotFoundError";
import BadRequestError from "../lib/errors/BadRequestError";
import { IdParamsStruct } from "../structs/commonStructs";
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/productsStruct";
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from "../structs/commentsStruct";
import { attachIsLiked } from "../lib/isLikedUtil";
import { AuthenticatedHandler, ExpressHandler } from "../types/common";

export const createProduct: AuthenticatedHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, price, tags, images } = create(
    req.body,
    CreateProductBodyStruct
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

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError("product", id);
  }

  res.send(product);
}

export async function updateProduct(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(
    req.body,
    UpdateProductBodyStruct
  );
  const userId = req.user?.userId;
  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  if (existingProduct.userId !== userId) {
    res
      .status(403)
      .send({ message: "상품을 등록한 사용자만 수정할 수 있습니다." });
    return;
  }
  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });
  res.send(updatedProduct);
}

export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const existingProduct = await prismaClient.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  if (existingProduct.userId !== userId) {
    res
      .status(403)
      .send({ message: "상품을 등록한 사용자만 삭제할 수 있습니다." });
    return;
  }
  await prismaClient.product.delete({ where: { id } });
  res.status(204).send();
}

export async function getProductList(
  req: Request,
  res: Response
): Promise<void> {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetProductListParamsStruct
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
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
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
  res: Response
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
    throw new NotFoundError("product", productId);
  }

  const comment = await prismaClient.comment.create({
    data: { productId, content, userId },
  });

  res.status(201).send(comment);
}

export async function getCommentList(
  req: Request,
  res: Response
): Promise<void> {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", productId);
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
}
