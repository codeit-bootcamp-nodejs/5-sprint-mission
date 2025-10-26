export function notFound(req, res) {
  res.status(404).json({ message: '요청한 경로를 찾을 수 없습니다.' });
}
