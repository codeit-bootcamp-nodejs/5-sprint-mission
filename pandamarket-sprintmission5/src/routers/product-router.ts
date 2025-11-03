import express from "express";
import { Controller } from "../controllers/controller";
import authenticate from "../middlewares/authenticate";
import { withAsync } from "../lib/withAsync";

const productRouter = express.Router();

productRouter.post(
  "/poduct",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerUploadProduct)
);
productRouter.get(
  "/poduct",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerGetAllProducts)
);
productRouter.get(
  "/poduct/id",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerGetProductDetail)
);
productRouter.patch(
  "/poduct/",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerUpdateProduct)
);
productRouter.delete(
  "/poduct/id",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerDeleteProduct)
);
productRouter.post(
  "/poduct/id",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerLikeProduct)
);
productRouter.patch(
  "/poduct/id",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerUnlikeProduct)
);
productRouter.get(
  "/poduct/me",
  authenticate({ optional: false }),
  withAsync(Controller.prouduct.handlerGetMyProducts)
);

export default productRouter;
