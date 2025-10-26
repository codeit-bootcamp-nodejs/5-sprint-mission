import express from "express";

export const userRoutes = (userController) => {
  const router = express.Router();

  router.post("/signup", userController.signup);
  router.post("/login", userController.login);
  router.post("/refresh-token", userController.refreshToken);

  router.get("/profile", authMiddleware, userController.getProfile);
  router.put("/profile", authMiddleware, userController.updateProfile);
  router.put("/change-password", authMiddleware, userController.changePassword);
  router.get("/products", authMiddleware, userController.getUserProducts);

  return router;
};
