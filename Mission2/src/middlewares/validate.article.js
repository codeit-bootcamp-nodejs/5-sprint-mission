export default function validateArticle(req, res, next) {
  const { title, content } = req.body;

  if (!title || typeof title !== "string" || title.length > 100) {
    return res.status(400).json({ error: "게시글 제목을 작성해주세요. (100자 미만으로 작성해주세요)" });
  }

  if (!content || typeof content !== "string" || content.length >= 3000) {
    return res.status(400).json({ error: "게시글 내용을 작성해주세요. (3000자 이하로 작성해주세요.)" });
  }

  next();
}