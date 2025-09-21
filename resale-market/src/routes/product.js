import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "../utils/struct.js";
import asyncHandler from "../utils/exceptions-handler.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

const upload = multer({ dest: "uploads/" });

productRouter
  .route("/")
  .post(
    upload.single("image"),
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const imageUrl = req.body ? `/product/${req.file.filename}` : {};
      const product = await prisma.product.create({
        data: {
          ...req.body,
          imageUrl,
        },
      });
      res.send(product);
    }),
  )

  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, search = "" } = req.query;
      const condition = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const products = await prisma.product.findMany({
        where: condition,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.send(products);
    }),
  );

productRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
      });
      res.send(product);
    }),
  )

  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);
      const { id } = req.params;
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(product);
    }),
  )

  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export default productRouter;
