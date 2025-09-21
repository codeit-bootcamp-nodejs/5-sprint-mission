const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

// 게시글 목록 조회
export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  return fetch(`${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error(err.message));
}

// 특정 게시글 조회
export function getArticle(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error(err.message));
}

// 게시글 생성
export function createArticle(title, content, image) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error(err.message));
}

// 게시글 수정
export function patchArticle(id, data) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error(err.message));
}

// 게시글 삭제
export function deleteArticle(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error(err.message));
}
