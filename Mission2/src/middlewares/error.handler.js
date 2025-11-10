import multer from "multer";

export default function errorHandler(err, req, res, next) {
  console.log(err.stack);
  console.error(err);

  if (res.headersSent) {
    return next (err)
  };

  if (err.code === "P2002") {
    return res.status(409).json({ error: "중복된 데이터입니다." });
  };

  if (err.code === "P2025") {
    return res.status(404).json({ error: "해당 리소스를 찾을 수 없습니다." });
  };

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  };

  if (err instanceof Error && err.message.includes("이미지")) {
    return res.status(400).json({ error: err.message });
  };

  res.status(500).json({ error: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
};