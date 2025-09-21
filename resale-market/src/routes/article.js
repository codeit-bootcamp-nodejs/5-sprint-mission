import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateArticle, PatchArticle } from "../utils/struct.js";
import asyncHandler from "../utils/exceptions-handler.js";

const prisma = new PrismaClient();
const articleRouter = express.Router();

articleRouter
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.send(article);
    }),
  )

  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, search = "" } = req.query;
      const condition = search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const articles = await prisma.article.findMany({
        where: condition,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.send(articles);
    }),
  );

articleRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id },
      });
      res.send(article);
    }),
  )

  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.send(article);
    }),
  )

  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export default articleRouter;
