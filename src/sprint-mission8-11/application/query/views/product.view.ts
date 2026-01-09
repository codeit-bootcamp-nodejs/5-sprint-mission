export interface ProductView {
  id: string;
  name: string;
  description: string;
  price: number;
  
  productTags: {
    tagName: string;
  }[];

  productImages: {
    url: string;
  }[];

  writer: {
    ownerId: string;
  };
}