import fs from "fs";
import path from "path";
import multer from "multer";

const dir = process.env.UPLOAD_DIR || "public/uploads";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name =
      Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    cb(null, name + ext);
  },
});
export const upload = multer({ storage });
