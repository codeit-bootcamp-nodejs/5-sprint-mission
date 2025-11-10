const mainUrl = "https://panda-market-api-crud.vercel.app";
const headers = {
  "Content-Type": "application/json",
}

export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  return fetch(`${mainUrl}/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`, {
    headers,
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    return res.json();
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
}

export function getArticle(id) {
  return fetch(`${mainUrl}/articles/${id}`, {
    headers,
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    return res.json();
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
}

export function createArticle(title, content, image) {
  return fetch(`${mainUrl}/articles`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, content, image }),
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    return res.json();
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
}

export function patchArticle(id, title, content, image) {
  return fetch(`${mainUrl}/articles/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ title, content, image }),
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    return res.json();
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
}

export function deleteArticle(id) {
  return fetch(`${mainUrl}/articles/${id}`, {
    method: "DELETE",
    headers,
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    return res.json();
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
}