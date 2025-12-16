import express, { Router, Request, Response } from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import { getMyInfo, updateMyInfo } from "../controllers/userInfo.controller";

const userRouterCA: Router = express.Router();

userRouterCA.get(
  "/me",
  authMiddleware,
  withAsync((req: Request, res: Response) => getMyInfo(req, res)),
);

userRouterCA.patch(
  "/me",
  authMiddleware,
  withAsync((req: Request, res: Response) => updateMyInfo(req, res)),
);

export default userRouterCA;
