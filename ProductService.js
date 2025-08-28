
 // product 요청함수 구현하기

const PRODUCT_BASE_URL = 'https://panda-market-api-crud.vercel.app/products';

// 상품리스트 GET 메소드 사용 (page, pageSize, keyword쿼리 파라미터 이용)

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const url = `${PRODUCT_BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error (`리스트 불러오기 실패 (${res.status})`);
    return await res.json();
} catch(err) {
  console.error ("리스트 에러: ", err.message);
  return null;
 }
}

// 상품 조회(getProduct) GET메소드사용

export async function getProduct(id) {
  try {
    const res = await fetch(`${PRODUCT_BASE_URL}/${id}`);
    if (!res.ok) throw new Error (`조회실패 (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('조회에러:', err.message);
    return null;
  } 
}

//상품 생성 POST메소드사용. 바디에 name, description, price, tags, image 포함

export async function createProduct({name, description, price, tags = [], images = []}) {
  try {
    const res = await fetch(PRODUCT_BASE_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, description, price, tags, images }),
    });

    if(!res.ok) throw new Error(`생성 실패 (${res.status})`);
    return await res.json();
  } catch(err) {
    console.log('생성 에러', err.message);
    return null;
  } 
}

// 상품수정 patchProduct id, updateData사용 PATCH 메소드

export async function patchProduct(id, updateData) {
  try {
    const res = await fetch(`${PRODUCT_BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: {'Content-Type': 'application/json'},
    });

    if (!res.ok) throw new Error(`수정 실패 (${res.status})`);
    return await res.json();
  } catch(err) {
    console.log('수정 에러', err.message);
    return null;
  }
}

// 상품삭제(delete) 보통 삭제는 바디 없대 id

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${PRODUCT_BASE_URL}/${id}`, {method: 'DELETE'});
    if(!res.ok) throw new Error(`삭제 실패 (${res.status})`);
    return await res.json();
  } catch(err) {
    console.log('삭제 에러' , err.message);
    return null;
  } 
}