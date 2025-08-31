const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// 2xx가 아니면 에러 출력
async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text();
    console.error(`Product API Error: ${res.status} ${res.statusText} - ${msg}`);
    throw new Error(msg);
  }
  return res.json();
}

// 상품 리스트 조회 (page, pageSize, keyword)
export async function getProductList({ page = 1, pageSize = 10, keyword = '' } = {}) {
  try {
    const url = new URL(`${BASE_URL}/products`);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);
    url.searchParams.set('keyword', keyword);
    const res = await fetch(url.toString());
    return await handleResponse(res);
  } catch (err) {
    console.error('getProductList() failed:', err);
    throw err;
  }
}

// 상품 상세 조회
export async function getProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    return await handleResponse(res);
  } catch (err) {
    console.error('getProduct() failed:', err);
    throw err;
  }
}

// 상품 생성 (name, description, price, tags, images)
export async function createProduct(body) {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error('createProduct() failed:', err);
    throw err;
  }
}

// 상품 수정
export async function patchProduct(id, body) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error('patchProduct() failed:', err);
    throw err;
  }
}

// 상품 삭제
export async function deleteProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    return await handleResponse(res);
  } catch (err) {
    console.error('deleteProduct() failed:', err);
    throw err;
  }
}
