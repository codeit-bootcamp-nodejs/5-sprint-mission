const mainUrl = "https://panda-market-api-crud.vercel.app";
const headers = {
  "Content-Type": "application/json",
}

export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  try {
    const res = await fetch(`${mainUrl}/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`, {
      headers,
    })
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${mainUrl}/products/${id}`, {
      headers,
    })
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function createProduct(name, description, price, tags, images) {
  try {
    const res = await fetch(`${mainUrl}/products`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, description, price, tags, images }),
    })
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function patchProduct(id, name, description, price, tags, images) {
  try {
    const res = await fetch(`${mainUrl}/products/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ name, description, price, tags, images }),
    })
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${mainUrl}/products/${id}`, {
      method: "DELETE",
      headers,
    })
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`)
    };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}