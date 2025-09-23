export default function validateProduct(req, res, next) {
  const { name, description, price, tags } = req.body;

  if (!name || typeof name !== "string" || name.length > 60) {
    return res.status(400).json({ error: "해당 이름의 상품이 없습니다. (해당 상품의 이름을 작성해주세요. 단, 상품 이름은 60자 미만이여야 합니다.)" });
  };

  if (!description || typeof description !== "string" || description.length >= 100) {
    return res.status(400).json({ error: "해당 상품의 설명이 없습니다. (해당 상품의 설명을 작성해주세요. 단, 상품의 설명은 100자 이하여야 합니다.)" });
  };

  if (price === undefined || typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "해당 상품의 가격이 조회되지 않습니다. (해당 상품의 금액을 기재해주세요. 단, 0원 이하는 불가능합니다.)" });
  };

  if (!Array.isArray(tags || tags.length === 0)) {
    return res.status(400).json({ error: "해당 상품의 tag가 조회되지 않습니다. (tag는 배열 형식으로 작성해주세요. 최소 1개 이상이어야 합니다.)" });
  };

  next();
};