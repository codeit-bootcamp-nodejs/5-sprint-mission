const ARTICLE_BASE_URL = 'https://panda-market-api-crud.vercel.app/articles';

export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  const url = `${ARTICLE_BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
  return fetch(url)
  .then(response => {
    if(!response.ok) throw new Error(`리스트 가져오기 실패 (${response.status})`);
    return response.json();  
  })
  .catch(error => {});
 }

 export function getArticle(id) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`)
  .then(response => {
    if(!response.ok)throw new Error(`글 못 불러옴 (${response.status}`);
    return response.json();
  })
  .catch(() => {});
 }

 export function createArticle({title, content, image}) {
  return fetch(ARTICLE_BASE_URL, {
    method: 'POST',
    body: JSON.stringify({title, content, image}),
    headers: {'Content-Type' : 'application/json'},
  })
    .then(response => {
      if(!response.ok) throw new Error(`글 작성 실패 (${response.status})`);
      return response.json();
    })
    .catch(() =>{} );
   
 }


 export function patchArticle(id, updateData) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
    headers: {'Content-Type': 'application/json'},
    })
      .then(response => {
        if(!response.ok) throw new Error(`글 수정 실패 (${response.status})`);
        return response.json();
    })
    .catch(() => {});
 }

 export function deleteArticle(id) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`, { method: 'DELETE' })
  .then(response => {
    if(!response.ok) throw new Error(`글 삭제 실패 (${response.status})`);
    return response.json();
  })
  .catch(()=> {});
 }
