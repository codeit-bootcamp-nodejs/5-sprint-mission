import ElectronicProduct from "../entity/electronic-product.js";
import ProductId from "../entity/product-id.js";
import Product from "../entity/product.js";
import BaseRepository from "./base-repository.js";

export default class ProductRepository extends BaseRepository {
  constructor() {
    super("products");
  }

  async getProductList(params) {
    try {
      const res = await this.instance.get("", {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          orderBy: params.orderBy,
        },
      });

      const { list } = res.data;

      return list.map(
        (item) =>
          new Product(
            item.id,
            item.name,
            item.description,
            item.price,
            item.tags,
            item.images,
            item.createdAt,
            item.updatedAt,
          ),
      );
    } catch (e) {
      if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Data:", e.response.data);
      } else {
        console.error("Message:", e.message);
      }
    }
  }
  async getElectronicList(params) {
    try {
      const res = await this.instance.get("", {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          orderBy: params.orderBy,
        },
      });

      const { list } = res.data;

      return list
        .filter((item) => item.tags && item.tags.includes("전자제품"))
        .map(
          (electronicItem) =>
            new ElectronicProduct(
              electronicItem.id,
              electronicItem.name,
              electronicItem.description,
              electronicItem.price,
              electronicItem.tags,
              electronicItem.images,
              electronicItem.createdAt,
              electronicItem.updatedAt,
            ),
        );
    } catch (e) {
      if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Data:", e.response.data);
      } else {
        console.error("Message:", e.message);
      }
    }
  }

  async getProduct(id) {
    try {
      const res = await this.instance.get(`/${id}`);
      const item = res.data;
      return new Product(
        item.id,
        item.name,
        item.description,
        item.price,
        item.tags,
        item.images,
        item.createdAt,
        item.updatedAt,
      );
    } catch (e) {
      if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Data:", e.response.data);
      } else {
        console.error("Message:", e.message);
      }
    }
  }

  async createProduct(surveyData) {
    try {
      const res = await this.instance.post("/", surveyData);
      const item = res.data;
      return new Product(
        item.id,
        item.name,
        item.description,
        item.price,
        item.tags,
        item.images,
        item.createdAt,
        item.updatedAt,
      );
    } catch (e) {
      if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Data:", e.response.data);
      } else {
        console.error("Message:", e.message);
      }
    }
  }

  async patchProduct(id, surveyData) {
    try {
      const res = await this.instance.patch(`/${id}`, surveyData);
      const item = res.data;
      return new Product(
        item.id,
        item.name,
        item.description,
        item.price,
        item.tags,
        item.images,
        item.createdAt,
        item.updatedAt,
      );
    } catch (e) {
      if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Data:", e.response.data);
      } else {
        console.error("Message:", e.message);
      }
    }
  }

  async deleteProduct(id) {
    try {
      const res = await this.instance.delete(`/${id}`, {
        data: { id: id },
      });
      const item = res.data;
      return new ProductId(item.id);
    } catch (e) {
      if (e.response) {
        console.error("Status:", e.response.status);
        console.error("Data:", e.response.data);
      } else {
        console.error("Message:", e.message);
      }
    }
  }
}
