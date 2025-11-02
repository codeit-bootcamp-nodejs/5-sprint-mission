import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";
import { parseIdParam } from "../middlewares/params";
import { validateCreateComment, validateUpdateComment } from "../middlewares/validator";
import * as c from "../controllers/comment.controller";

const router = Router({ mergeParams: true });

router.get("/", optionalAuthenticate, parseIdParam("productId"), c.listForProduct);
router.post("/", authenticate, parseIdParam("productId"), validateCreateComment, c.createForProduct);
router.patch("/:commentId", authenticate, parseIdParam("commentId"), validateUpdateComment, c.update);
router.delete("/:commentId", authenticate, parseIdParam("commentId"), c.remove);

export default router;
