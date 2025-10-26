export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "요청하신 리소스를 찾을 수 없습니다." });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "서버 오류가 발생했습니다.",
    detail: err.detail || undefined,
  });
};
