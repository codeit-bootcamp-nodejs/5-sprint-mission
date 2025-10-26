export function validateComment(req, res, next) {
  const { content } = req.body;

  if (
    !content ||
    typeof content !== "string" ||
    content.length < 1 ||
    content.length > 300
  ) {
    return res
      .status(400)
      .json({ error: "댓글 내용을 1자 이상 300자 이하로 입력해주세요." });
  }

  next();
}
