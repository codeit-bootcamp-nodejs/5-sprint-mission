export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  tags?: string[];
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
}
