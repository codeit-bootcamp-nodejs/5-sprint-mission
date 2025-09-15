import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateProduct, PatchProduct } from "../util/struct.js";
import { assert } from "superstruct";
import { asyncHandler } from "../util/async-handler.js";

const prisma = new PrismaClient();
export const productRouter = express.Router();
productRouter
  .route("/")
  .get(
    asyncHandler(async (req, res, next) => {
      const {
        offset = 0,
        limit = 10,
        order = "recent",
        name = "",
        description = "",
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
      if (name) {
        where.name = {
          contains: name,
        };
      }
      if (description) {
        where.description = {
          contains: description,
        };
      }
      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
        select: {
          id: true,
          name: true,
          price: true,
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
      res.send(products);
    })
  )
  .post(
    asyncHandler(async (req, res, next) => {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({
        data: req.body,
      });
      res.status(201).send(product);
    })
  );

productRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const product = await prisma.product.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          tags: true,
          price: true,
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
      res.send(product);
    })
  )
  .patch(
    asyncHandler(async (req, res, next) => {
      assert(req.body, PatchProduct);
      const { id } = req.params;
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(product);
    })
  )
  .delete(
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });
      res.status(204).end();
    })
  );
