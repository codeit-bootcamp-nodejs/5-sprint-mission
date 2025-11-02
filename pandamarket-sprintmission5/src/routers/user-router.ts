import express from "express";
import authenticate from "../middlewares/authenticate";
import { withAsync } from "../lib/withAsync";
import { Controller } from "../controllers/controller";

const userRouter = express.Router();

userRouter.get(
  "/me",
  authenticate({ optional: false }),
  withAsync(Controller.user.handleGetMyInfo),
);
userRouter.patch(
  "/me",
  authenticate({ optional: false }),
  withAsync(Controller.user.handleUpdateMyInfo),
);
userRouter.patch(
  "/me",
  authenticate({ optional: false }),
  withAsync(Controller.user.handleChangeMyPassword),
);

export default userRouter;
