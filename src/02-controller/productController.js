export class ProductController {
  #productService;
  constructor(productService) {
    this.#productService = productService;
  }

  createProduct = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const product = await this.#productService.createProduct(userId, req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  getProducts = async (req, res, next) => {
    try {
      const userId = req.user?.id; 
      const products = await this.#productService.getProducts(userId);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  toggleLike = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const like = await this.#productService.toggleLike(userId, productId);
      res.status(200).json(like);
    } catch (err) {
      next(err);
    }
  };
}
