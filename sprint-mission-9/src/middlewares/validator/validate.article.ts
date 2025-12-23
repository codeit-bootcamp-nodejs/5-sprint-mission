import { Request, Response, NextFunction } from "express";

export function validateArticle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title, content } = req.body;

  if (
    !title ||
    typeof title !== "string" ||
    title.length >= 50 ||
    title.length <= 1
  ) {
    return res
      .status(400)
      .json({ error: "게시글 제목을 1자 이상 50자 이하로 입력해주세요." });
  }

  if (
    !content ||
    typeof content !== "string" ||
    content.length >= 3000 ||
    content.length <= 1
  ) {
    return res
      .status(400)
      .json({ error: "게시글 내용을 1자 이상 3000자 이하로 입력해주세요." });
  }

  next();
}
