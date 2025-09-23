import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import validateProduct from "../middlewares/validate.product.js";
import upload from "../middlewares/upload.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, keyword = "", sort = "recent" } = req.query;

    const products = await prisma.product.findMany({
      skip: parseInt(offset) || 0,
      take: parseInt(limit) || 10,
      where: {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      },
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: { 
        id: true, 
        name: true, 
        price: true, 
        createdAt: true 
      },
    });

    res.json(products);
  } catch(e) {
    next(e);
  }
});

router.post("/", validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        tags,
      },
    });

    res.status(201).json(product);
  } catch(e) {
    next(e);
  }
});

router.patch("/:id", validateProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { 
        name,
        description,
        price: parseFloat(price) || 0,
        tags,
      },
    });

    res.json(updatedProduct);
  } catch(e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
    };
    next(e);
  };
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch(e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
    };
    next(e);
  };
});

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "이미지 파일을 찾을 수 없습니다." });
  };

  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ path: imagePath });
});

export default router;