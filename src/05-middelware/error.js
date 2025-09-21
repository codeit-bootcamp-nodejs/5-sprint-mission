export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: '파일 업로드 오류' });
  }

  if (err.message === '이미지 파일만 업로드 가능합니다.') {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: '서버 오류' });
};
