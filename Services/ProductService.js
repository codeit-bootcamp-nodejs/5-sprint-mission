import Product from "../Models/Product.js";
import ElectronicProduct from "../Models/ElectronicProduct.js";

const BASE_URL = "https://panda-market-api-crud.vercel.app";

// 상품 리스트 조회
export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  try {
    const response = await fetch(
      `${BASE_URL}/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
    );

    if (!response.ok) {
      throw new Error(`상품 목록 조회 실패: ${response.status}`);
    }

    const data = await response.json();

    // 상품 리스트 -> 인스턴스 배열로 변환
    const products = data.map((item) => {
      if (item.tags.includes("전자제품")) {
        return new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount,
          item.manufacturer
        );
      } else {
        return new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount
        );
      }
    });

    return products;
  } catch (error) {
    console.error("getProductList 에러:", error.message);
    return [];
  }
}

// 특정 상품 조회
export async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`상품 조회 실패: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("getProduct 에러:", error.message);
  }
}

// 상품 생성
export async function createProduct(productData) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`상품 생성 실패: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("createProduct 에러:", error.message);
  }
}

// 상품 수정
export async function patchProduct(id, updateData) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error(`상품 수정 실패: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("patchProduct 에러:", error.message);
  }
}

// 상품 삭제
export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`상품 삭제 실패: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("deleteProduct 에러:", error.message);
  }
}
