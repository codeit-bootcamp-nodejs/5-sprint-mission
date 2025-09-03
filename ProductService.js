
const PRODUCT_BASE_URL = 'https://panda-market-api-crud.vercel.app/products';


export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const url = `${PRODUCT_BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error (`리스트 불러오기 실패 (${res.status})`);
    return await res.json();
} catch {
  return null;
 }
}


export async function getProduct(id) {
  try {
    const res = await fetch(`${PRODUCT_BASE_URL}/${id}`);
    if (!res.ok) throw new Error (`조회실패 (${res.status})`);
    return await res.json();
  } catch {
    return null;
  } 
}


export async function createProduct({name, description, price, tags = [], images = []}) {
  try {
    const res = await fetch(PRODUCT_BASE_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, description, price, tags, images }),
    });

    if(!res.ok) throw new Error(`생성 실패 (${res.status})`);
    return await res.json();
  } catch {
    return null;
  } 
}


export async function patchProduct(id, updateData) {
  try {
    const res = await fetch(`${PRODUCT_BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: {'Content-Type': 'application/json'},
    });

    if (!res.ok) throw new Error(`수정 실패 (${res.status})`);
    return await res.json();
  } catch {
    return null;
  }
}


export async function deleteProduct(id) {
  try {
    const res = await fetch(`${PRODUCT_BASE_URL}/${id}`, {method: 'DELETE'});
    if(!res.ok) throw new Error(`삭제 실패 (${res.status})`);
    return await res.json();
  } catch {
    return null;
  } 
}