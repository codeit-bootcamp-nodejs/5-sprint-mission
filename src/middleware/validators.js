function bad(m) {
  const e = new Error(m);
  e.status = 400;
  return e;
}
export function validateCreateProduct(req, res, next) {
  const { name, description, price, tags = [] } = req.body ?? {};
  if (!name || name.trim().length < 2) return next(bad("상품명은 최소 2자"));
  if (!description || description.trim().length < 2)
    return next(bad("설명은 최소 2자"));
  const num = Number(price);
  if (!Number.isInteger(num) || num < 0)
    return next(bad("가격은 0 이상의 정수"));
  if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string"))
    return next(bad("태그는 문자열 배열"));
  req.validated = { name, description, price: num, tags };
  next();
}
export function validateUpdateProduct(req, res, next) {
  const { name, description, price, tags, imageUrl } = req.body ?? {},
    dto = {};
  if (name !== undefined) {
    if (!name || name.trim().length < 2) return next(bad("상품명은 최소 2자"));
    dto.name = name;
  }
  if (description !== undefined) {
    if (!description || description.trim().length < 2)
      return next(bad("설명은 최소 2자"));
    dto.description = description;
  }
  if (price !== undefined) {
    const n = Number(price);
    if (!Number.isInteger(n) || n < 0) return next(bad("가격은 0 이상의 정수"));
    dto.price = n;
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string"))
      return next(bad("태그는 문자열 배열"));
    dto.tags = tags;
  }
  if (imageUrl !== undefined) dto.imageUrl = imageUrl;
  req.validated = dto;
  next();
}
export function validateCreateArticle(req, res, next) {
  const { title, content } = req.body ?? {};
  if (!title || title.trim().length < 2) return next(bad("제목은 최소 2자"));
  if (!content || content.trim().length < 2)
    return next(bad("내용은 최소 2자"));
  req.validated = { title, content };
  next();
}
export function validateUpdateArticle(req, res, next) {
  const { title, content } = req.body ?? {},
    dto = {};
  if (title !== undefined) {
    if (!title || title.trim().length < 2) return next(bad("제목은 최소 2자"));
    dto.title = title;
  }
  if (content !== undefined) {
    if (!content || content.trim().length < 2)
      return next(bad("내용은 최소 2자"));
    dto.content = content;
  }
  req.validated = dto;
  next();
}
export function validateCreateComment(req, res, next) {
  const { content } = req.body ?? {};
  if (!content || content.trim().length < 1)
    return next(bad("댓글은 1자 이상"));
  req.validated = { content };
  next();
}
