export const validateSignup = (req, res, next) => {
  const { email, nickname, password } = req.body || {};
  if (!email || !nickname || !password)
    return res.status(400).json({ message: "email, nickname, password는 필수입니다." });
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "email, password는 필수입니다." });
  next();
};

export const validateCreateProduct = (req, res, next) => {
  const { name, description, price } = req.body || {};
  if (!name || !description || price == null)
    return res.status(400).json({ message: "name, description, price는 필수입니다." });
  next();
};

export const validateCreateArticle = (req, res, next) => {
  const { title, content } = req.body || {};
  if (!title || !content)
    return res.status(400).json({ message: "title, content는 필수입니다." });
  next();
};

export const validateCreateComment = (req, res, next) => {
  const { content } = req.body || {};
  if (!content || content.trim().length === 0)
    return res.status(400).json({ message: "content는 필수입니다." });
  next();
};
