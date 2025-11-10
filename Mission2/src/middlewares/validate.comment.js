export default function validateComment(req, res, next) {
  const { content } = req.body;
  if (!content || typeof content !== "string" || content.length >= 300) {
    return res.status(400).json({ error: "댓글 내용을 작성해주세요. (300자 이하로 작성해주세요.)" });
  }
  next();
}