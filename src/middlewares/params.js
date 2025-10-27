export const parseIdParam =
  (param = "id") =>
  (req, res, next) => {
    const raw = req.params[param];
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1) {
      return res
        .status(400)
        .json({ message: `${param}는 1 이상의 정수여야 합니다.` });
    }
    req.params[param] = n;
    next();
  };
