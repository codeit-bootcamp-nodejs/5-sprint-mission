export function notFound(req, res, next) {
  res.status(404).json({ message: "리소스를 찾을 수 없습니다." });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "내부 서버 오류" });
}
