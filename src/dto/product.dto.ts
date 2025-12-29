export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}

export interface ProductListQueryDto {
  offset: number;
  limit: number;
  keyword: string;
  sort: "recent" | "asc";
}
