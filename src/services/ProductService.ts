import {
  Product,
  ProductCreateData,
  ProductListParams,
  ProductListResponse,
} from "../types/models";
import { StringOrNumber, PromiseResult, AsyncResult } from "../types/common";

const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

// PromiseResult
export async function getProductList({
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent",
}: ProductListParams = {}): PromiseResult<ProductListResponse> {
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}&orderBy=${orderBy}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { totalCount, list } = await res.json();

    return { totalCount, list };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("getProductList:", error.message);
    throw error;
  }
}

// 반환값에 as 
export async function getProduct(productId: StringOrNumber) {
  try {
    const res = await fetch(`${BASE_URL}/${productId}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return (await res.json()) as Product;
  } catch (err: unknown) {
    const error = err as Error;
    console.error("getProduct Error:", error.message);
    throw error;
  }
}

// 상품 생성 - 반환값에 as 
export async function createProduct(data: ProductCreateData) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return (await res.json()) as Product;
  } catch (err: unknown) {
    const error = err as Error;
    console.error("createProduct Error:", error.message);
    throw error;
  }
}

// 상품 수정 - 반환값에 as 
export async function patchProduct(
  productId: StringOrNumber,
  data: ProductCreateData
) {
  try {
    const res = await fetch(`${BASE_URL}/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return (await res.json()) as Product;
  } catch (err: unknown) {
    const error = err as Error;
    console.error("patchProduct Error:", error.message);
    throw error;
  }
}

//상품 삭제 - 반환값에 as 
export async function deleteProduct(productId: StringOrNumber) {
  try {
    const res = await fetch(`${BASE_URL}/${productId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return (await res.json()) as { message: string };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("deleteProduct Error:", error.message);
    throw error;
  }
}
