import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateComment, PatchComment } from "../utils/struct.js";
import asyncHandler from "../utils/exceptions-handler.js";

const prisma = new PrismaClient();

const productCommentRouter = express.Router({ mergeParams: true });
const articleCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

productCommentRouter
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      assert(req.body, CreateComment);
      const comment = await prisma.comment.create({
        data: {
          ...req.body,
          productId: productId,
        },
      });
      res.send(comment);
    }),
  )

  .get(
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const { cursor, limit = 5 } = req.query;

      const condition = {
        productId: productId,
        ...(cursor ? { createdAt: { lt: cursor } } : {}),
      };

      const comments = await prisma.comment.findMany({
        where: condition,
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: Number(limit) + 1,
      });
      res.send(comments);
    }),
  );

articleCommentRouter
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      assert(req.body, CreateComment);
      const comment = await prisma.comment.create({
        data: {
          ...req.body,
          articleId: articleId,
        },
      });
      res.send(comment);
    }),
  )

  .get(
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { cursor, limit = 10 } = req.query;

      const condition = {
        articleId: articleId,
        ...(cursor ? { createdAt: { lt: cursor } } : {}),
      };

      const comments = await prisma.comment.findMany({
        where: condition,
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: Number(limit) + 1,
      });
      res.send(comments);
    }),
  );

commentRouter
  .route("/:id")
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchComment);
      const { id } = req.params;
      const comment = await prisma.comment.update({
        where: { id },
        data: req.body,
      });
      res.send(comment);
    }),
  )

  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const comment = await prisma.comment.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export { productCommentRouter, articleCommentRouter, commentRouter };
