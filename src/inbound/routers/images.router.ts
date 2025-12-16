import express from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import { upload, uploadImage } from "../controllers/image.controller";

const imagesRouter = express.Router();

imagesRouter.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  withAsync(uploadImage),
);

export default imagesRouter;
