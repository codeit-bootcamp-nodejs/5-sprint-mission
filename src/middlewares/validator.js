export const validateSignup = (req, res, next) => {
  const { email, nickname, password } = req.body || {};
  if (!email || !nickname || !password) {
    return res.status(400).json({ message: "email, nickname, password는 필수입니다." });
  }
   if (!email.includes("@")) {
    return res.status(400).json({ message: "올바른 이메일 형식이 아닙니다." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "비밀번호는 최소 6자 이상이어야 합니다." });
  }
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
 
  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({ message: "price는 0 이상의 숫자여야 합니다." });
  }
   next();
};

export const validateUpdateProduct = (req, res, next) => {
  const { name, description, price } = req.body || {};

  if (name === "" || description === "" || price === "") {
    return res
      .status(400)
      .json({ message: "빈 문자열은 허용되지 않습니다." });
  }

  if (price != null && (typeof price !== "number" || price < 0)) {
    return res
      .status(400)
      .json({ message: "price는 0 이상의 숫자여야 합니다." });
  }
  next();
};

export const validateCreateArticle = (req, res, next) => {
  const { title, content } = req.body || {};
  if (!title || !content)
    return res.status(400).json({ message: "title, content는 필수입니다." });
  next();
};

export const validateUpdateArticle = (req, res, next) => {
  const { title, content } = req.body || {};

  if (title === "" || content === "") {
    return res.status(400).json({ message: "빈 문자열은 허용되지 않습니다." });
  }
  next();
};


export const validateCreateComment = (req, res, next) => {
  const { content } = req.body || {};
  if (!content || content.trim().length === 0)
    return res.status(400).json({ message: "content는 필수입니다." });
  next();
};

export const validateUpdateComment = (req, res, next) => {
  const { content } = req.body || {};

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "댓글 내용은 비워둘 수 없습니다." });
  }
  next();
};

