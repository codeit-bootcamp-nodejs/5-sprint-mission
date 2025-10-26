const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// 2xx가 아니면 에러 출력
function handleResponse(res) {
  if (!res.ok) {
    return res.text().then((msg) => {
      console.error(`Article API Error: ${res.status} ${res.statusText} - ${msg}`);
      throw new Error(msg);
    });
  }
  return res.json();
}

// 게시글 리스트 조회 (page, pageSize, keyword)
export function getArticleList({ page = 1, pageSize = 10, keyword = '' } = {}) {
  const url = new URL(`${BASE_URL}/articles`);
  url.searchParams.set('page', page);
  url.searchParams.set('pageSize', pageSize);
  url.searchParams.set('keyword', keyword);
  return fetch(url.toString())
    .then(handleResponse)
    .catch((err) => { console.error('getArticleList() failed:', err); throw err; });
}

// 게시글 상세 조회
export function getArticle(id) {
  return fetch(`${BASE_URL}/articles/${id}`)
    .then(handleResponse)
    .catch((err) => { console.error('getArticle() failed:', err); throw err; });
}

// 게시글 생성 (title, content, image 포함)
export function createArticle(body) {
  return fetch(`${BASE_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch((err) => { console.error('createArticle() failed:', err); throw err; });
}

// 게시글 수정
export function patchArticle(id, body) {
  return fetch(`${BASE_URL}/articles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch((err) => { console.error('patchArticle() failed:', err); throw err; });
}

// 게시글 삭제
export function deleteArticle(id) {
  return fetch(`${BASE_URL}/articles/${id}`, { method: 'DELETE' })
    .then(handleResponse)
    .catch((err) => { console.error('deleteArticle() failed:', err); throw err; });
}
