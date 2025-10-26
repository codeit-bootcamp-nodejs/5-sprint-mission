export const validateProductCreate = (req, res, next) => {
  const { name, description, price, tags } = req.body;

  if (!name || !description || price == null) {
    return res.status(400).json({ message: 'name, description, price는 필수입니다.' });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'price는 0 이상의 숫자여야 합니다.' });
  }

  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ message: 'tags는 문자열 배열이어야 합니다.' });
  }

  next();
};

export const validateArticleCreate = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'title과 content는 필수입니다.' });
  }

  next();
};

export const validateCommentCreateForProduct = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '댓글 내용(content)이 필요합니다.' });
  }

  if (!Number(req.params.productId)) {
    return res.status(400).json({ message: '유효한 productId가 필요합니다.' });
  }

  next();
};

export const validateCommentCreateForArticle = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '댓글 내용(content)이 필요합니다.' });
  }

  if (!Number(req.params.articleId)) {
    return res.status(400).json({ message: '유효한 articleId가 필요합니다.' });
  }

  next();
};
