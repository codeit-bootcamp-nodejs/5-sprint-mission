import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateComment, PatchComment } from "../util/struct.js";
import { assert } from "superstruct";
import { asyncHandler } from "../util/async-handler.js";

const prisma = new PrismaClient();
const commentRouter = express.Router();

// --------------------- Product Comment ---------------------
export const productCommentRouter = express.Router();

productCommentRouter
  .route("/:id/comments")
  .get(
    asyncHandler(async (req, res, next) => {
      const comments = await prisma.comment.findMany({
        where: {
          productId: {
            not: null,
          },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      res.send(comments);
    })
  )
  .post(
    asyncHandler(async (req, res, next) => {
      assert(req.body, CreateComment);
      console.log(req.params);
      const { id } = req.params;
      const { content } = req.body;
      console.log(id);
      const comment = await prisma.comment.create({
        data: {
          content: content,
          product: {
            connect: {
              id: id,
            },
          },
        },
      });
      res.status(201).send(comment);
    })
  );
productCommentRouter
  .route("/:id/comments/:commentId")
  .patch(
    asyncHandler(async (req, res, next) => {
      assert(req.body, PatchComment);
      const { id, commentId } = req.params;
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: req.body,
      });
      res.send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res, next) => {
      const { id, commentId } = req.params;
      await prisma.comment.delete({
        where: { id: commentId },
      });
      res.status(204).end();
    })
  );
// --------------------- Article Comment ---------------------
export const articleCommentRouter = express.Router();

articleCommentRouter
  .route("/:id/comments")
  .get(
    asyncHandler(async (req, res, next) => {
      const comments = await prisma.comment.findMany({
        where: {
          articleId: {
            not: null,
          },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      res.send(comments);
    })
  )
  .post(
    asyncHandler(async (req, res, next) => {
      assert(req.body, CreateComment);
      const { id } = req.params;
      const { content } = req.body;
      console.log(id, content);
      const comment = await prisma.comment.create({
        data: {
          content: content,
          article: {
            connect: {
              id: id,
            },
          },
        },
      });
      res.status(201).send(comment);
    })
  );
articleCommentRouter
  .route("/:id/comments/:commentId")
  .patch(
    asyncHandler(async (req, res, next) => {
      assert(req.body, PatchComment);
      const { id, commentId } = req.params;
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: req.body,
      });
      res.send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res, next) => {
      const { id, commentId } = req.params;
      console.log(commentId);
      await prisma.comment.delete({
        where: { id: commentId },
      });
      res.status(204).end();
    })
  );
