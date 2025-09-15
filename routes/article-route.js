import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateArticle, PatchArticle } from "../util/struct.js";
import { assert } from "superstruct";
import { asyncHandler } from "../util/async-handler.js";

const prisma = new PrismaClient();
export const articleRouter = express.Router();
articleRouter
  .route("/")
  .get(
    asyncHandler(async (req, res, next) => {
      const {
        offset = 0,
        limit = 10,
        order = "recent",
        title = "",
        content = "",
      } = req.query;

      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "recent":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
      const where = {};
      if (title) {
        where.title = {
          contains: title,
        };
      }
      if (content) {
        where.content = {
          contains: content,
        };
      }
      const articles = await prisma.article.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
      res.send(articles);
    })
  )
  .post(
    asyncHandler(async (req, res, next) => {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(article);
    })
  );

articleRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
      res.send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res, next) => {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.send(article);
    })
  )
  .delete(
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.status(204).end();
    })
  );
