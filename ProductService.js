import axios from "axios";

export class Product {
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount;

  constructor(name, description, price, tags = [], images = []) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = 0;
  }

  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get price() {
    return this.#price;
  }
  get tags() {
    return this.#tags;
  }
  get images() {
    return this.#images;
  }
  get favoriteCount() {
    return this.#favoriteCount;
  }

  favorite() {
    this.#favoriteCount++;
    console.log(
      `${this.name} 상품의 찜하기 수가 1 증가하여 ${this.favoriteCount}가 되었습니다.`,
    );
  }
}

export class ElectronicProduct extends Product {
  #manufacturer;

  constructor(name, description, price, tags = [], images = [], manufacturer) {
    super(name, description, price, tags, images);
    this.#manufacturer = manufacturer;
  }

  get manufacturer() {
    return this.#manufacturer;
  }
}

const instance = axios.create({
  baseURL: `https://panda-market-api-crud.vercel.app`,
});

export async function getProductList(params = {}) {
  try {
    const res = await instance.get(`/products`, { params });
    return res.data;
  } catch (error) {
    console.log("에러 발생");
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.log("에러 발생");
  }
}

export async function createProduct(bodyData) {
  try {
    const res = await instance.post(`/products`, bodyData);
    return res.data;
  } catch (error) {
    console.log("에러 발생");
  }
}

export async function patchProduct(id, bodyData) {
  try {
    const res = await instance.patch(`/products/${id}`, bodyData);
    return res.data;
  } catch (error) {
    console.log("에러 발생");
  }
}

export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.log("에러 발생");
  }
}
