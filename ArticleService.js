const ARTICLE_BASE_URL = 'https://panda-market-api-crud.vercel.app/articles';

// 글 목록 가져오기 (page, pageSize, keyword)
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  const url = `${ARTICLE_BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
  return fetch(url)
  .then(response => {
    if(!response.ok) throw new Error(`리스트 가져오기 실패 (${response.status})`);
    return response.json();  
  })
  .catch(error => {
    console.log('에러', error.message);
  });
 }

// 글 불러오기(id 필요)

 export function getArticle(id) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`)
  .then(response => {
    if(!response.ok)throw new Error(`글 못 불러옴 (${response.status}`);
    return response.json();
  })
  .catch(error => console.log('에러:', error.message));
 }

 // 글 작성하기 (create)
 // post 메소드사용 ({title, content, image})
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
    .catch(error => console.log("에러", error.message));
   
 }

// 글 수정하기
// id: 수정할 글의 아이디
// updateData: 수정할내용 {title, content, image}

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
    .catch(error => console.log('수정 에러:', error.message));
 }

 // 글 삭제하기
// 삭제할 글 id
 export function deleteArticle(id) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`, { method: 'DELETE' })
  .then(response => {
    if(!response.ok) throw new Error(`글 삭제 실패 (${response.status})`);
    return response.json();
  })
  .catch(error => console.log('에러:', error.message));
 }
