import axios from "axios";

export default class ProductService {
  #baseURL;

  constructor() {
    this.#baseURL = new URL(
      "https://panda-market-api-crud.vercel.app/products",
    ); // <== [중복됨] BaseURL 클래스를 만들어서 상속 받을 생각이었으나 과제 범위를 벗어날 것 같아서 멈췄습니다.
  }

  async getProductList(page, pageSize, keyword = "") {
    try {
      const response = await axios.get(
        `${this.#baseURL}?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`,
      );
      return response.data.list;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return [];
    }
  }

  async getProduct(productId) {
    try {
      const response = await axios.get(`${this.#baseURL}/${productId}`);
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }

  async createProduct(product) {
    try {
      const response = await axios.post(`${this.#baseURL}`, product, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }

  async patchProduct(productId, product) {
    try {
      const response = await axios.patch(
        `${this.#baseURL}/${productId}`,
        product,
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${this.#baseURL}/${productId}`);
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }
}
