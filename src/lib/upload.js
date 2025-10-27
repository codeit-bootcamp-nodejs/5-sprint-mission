import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({ storage });
export const buildImageUrl = (filename) =>
  `${process.env.IMAGE_BASE_URL || "http://localhost:3000"}/uploads/${filename}`;
