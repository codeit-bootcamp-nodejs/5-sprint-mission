import axios from "axios";
import Product from "../Entity/product.js";
import ElectronicProduct from "../Entity/product_electronic.js";


const instance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app/products',
  timeout: 100000,
});

export async function getProductList(params = {page : 1, pageSize : 10, keyword: ''}) {
  try {const res = await instance.get('', {params})
  return res.data
} catch (e) {
    console.error(e.message)
    throw e;
  }
}

export async function getProduct(id) {   
  try {const res = await instance.get(`/${id}`);
  return res.data;
} catch (e) {
    console.error(e.message)
    throw e;
  }
}

export async function createProduct(body) {
  try {const res = await instance.post('', body);
  return res.data;
} catch (e) {
    console.error(e.message)
    throw e;
  }
}

export async function patchProduct(id) {
  try {const res = await instance.patch(`/${id}`);
  return res.data;
} catch (e) {
    console.error(e.message)
    throw e;
  }
}

export async function deleteProduct(id) {
  try {const res = await instance.delete(`/${id}`);
  return res.data;
} catch (e) {
    console.error(e.message)
    throw e;
  }
}

export async function makeElectronicClass() {
  const { list } = await getProductList();
  const electronicProduct = list
  .filter(p => p.tags.includes('전자제품'))
  .map(p => new ElectronicProduct(p.name, p.description, p.price, p.tags, p.images))

  return electronicProduct;
}

export async function makeProductClass() {
  const { list } = await getProductList();
  const product = list
  .filter(p => !p.tags.includes('전자제품'))
  .map(p => new Product(p.name, p.description, p.price, p.tags, p.images))

  return product;
}



