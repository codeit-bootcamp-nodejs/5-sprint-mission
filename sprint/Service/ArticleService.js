import axios from "axios";

const instance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app/articles',
  timeout: 5000,
  
});

export function getArticleList(params = {page : 1, pageSize: 10, keyword: ''}) {
  return instance.get('', {params})
  .then( res => {
   return res.data;
  })
  .catch(e => {
    console.error(e.message)
     throw e;
  })
} 

export function getArticle(id) {
  return instance.get(`${id}`)
  .then(res => {
    return res.data;
  })
  .catch(e => {
    console.error(e.message)
     throw e;
  })
}

export function createArticle(body) {
  return instance.post('', body)
  .then(res => {
    return res.data;
  })
  .catch(e => {
    console.error(e.message)
     throw e;
  })
}


export function patchArticle(id) {
  return instance.patch(`${id}`)
  .then(res => {
    return res.data
  })
  .catch(e => {
    console.error(e.message)
     throw e;
  })
}

export function deleteArticle(id) {
  return instance.delete(`${id}`)
  .then(res => {
    return res.data
  })
  .catch(e => {
    console.error(e.message)
     throw e;
  })
}
