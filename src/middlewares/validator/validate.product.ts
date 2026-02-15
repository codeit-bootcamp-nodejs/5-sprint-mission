import { Request, Response, NextFunction } from "express";

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, description, price, tags } = req.body;

  if (!name || typeof name !== "string" || name.length > 20) {
    return res
      .status(400)
      .json({ error: "상품 이름을 20자 미만으로 입력해주세요." });
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.length > 100
  ) {
    return res
      .status(400)
      .json({ error: "상품 설명을 100자 미만으로 입력해주세요." });
  }

  const numPrice = parseFloat(price);

  if (isNaN(numPrice) || typeof numPrice !== "number" || numPrice < 0) {
    return res
      .status(400)
      .json({ error: "상품 가격은 0보다 큰 숫자로 입력해주세요." });
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return res.status(400).json({ error: "태그는 배열 형식이어야 합니다." });
  }

  req.body.price = numPrice;

  next();
}
