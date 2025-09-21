import { ProductService } from "../03-service/product.service.js"
const productService = new ProductService();

export class ProductController {
  create = async (req, res, next) => {
    try {
      const { name, description, price, tags = [] } = req.body;
      const product = await productService.create({ name, description, price, tags });
      res.status(201).json(product);
    } catch (e) { next(e); }
  };

  detail = async (req, res, next) => {
    try {
      const product = await productService.getById(req.params.id);
      res.status(200).json(product);
    } catch (e) { next(e); }
  };

  update = async (req, res, next) => {
    try {
      const updated = await productService.update(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (e) { next(e); }
  };

  remove = async (req, res, next) => {
    try {
      await productService.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  };

  list = async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
      const skip = (page - 1) * limit;
      const search = req.query.search || null;
      const sort = req.query.sort === "recent" ? "recent" : null;

      const result = await productService.list({ skip, take: limit, search, sort });
      res.status(200).json({ ...result, page, limit });
    } catch (e) { next(e); }
  };
}
