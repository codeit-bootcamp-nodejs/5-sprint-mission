import express from "express";
import { Controller } from "../controllers/controller.js";
import { withAsync } from "../lib/withAsync.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  withAsync(Controller.auth.handleSignUp)
);

authRouter.post(
  "/login",
  withAsync(Controller.auth.handleLogin)
);

authRouter.post(
  "/logout",
  withAsync(Controller.auth.handleLogout)
);

authRouter.post(
  "/refresh",
  withAsync(Controller.auth.handleReissueTokens)
);

export default authRouter;
