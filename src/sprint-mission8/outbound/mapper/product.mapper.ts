import { NewProductEntity, PersistProductEntity, ProductEntity, } from "../../domain/entity/product/product.entity";
import { ProductTagVo } from "../../domain/entity/product/product-tag.vo";
import { ProductImageVo } from "../../domain/entity/product/product-image.vo";
import { PersistProduct } from "../repos/product/product.repo";

export type CreateProductData = {
  userId: string;
  name: string;
  description: string;
  price: number;
};

export type UpdateProductData = {
  name: string;
  description: string;
  price: number;
};

export type ProductImageData = {
  url: string;
};

export type ProductTagData = {
  tagId: number;
};

export class ProductMapper {
  static toCreateData(entity: NewProductEntity): {
    productData: CreateProductData;
    productImagesData: ProductImageData[];
    productTagsData: ProductTagData[];
  } {
    const createProductData: CreateProductData = {
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      price: entity.price,
    };

    return {
      productData: createProductData,
      productImagesData: ProductMapper._mapProductImagesData(entity.images),
      productTagsData: ProductMapper._mapProductTagsData(entity.tags)
    };
  }

  static toUpdateData(entity: PersistProductEntity): {
    productData: UpdateProductData;
    productImagesData: ProductImageData[];
    productTagsData: ProductTagData[];
  } {
    const updateProductData: UpdateProductData = {
      name: entity.name,
      description: entity.description,
      price: entity.price,
    };

    return {
      productData: updateProductData,
      productImagesData: ProductMapper._mapProductImagesData(entity.images),
      productTagsData: ProductMapper._mapProductTagsData(entity.tags)
    };
  }

  static toPersistEntity(entity: PersistProduct): PersistProductEntity {
    return ProductEntity.createPersist({
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      tags: entity.tags.map((v) => ProductTagVo.create({
        tagId: v.tagId,
        name: v.tag.name
      })),
      images: entity.images.map((v) => ProductImageVo.create({
        url: v.url
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  private static _mapProductImagesData(
    productImages: ProductImageVo[],
  ): ProductImageData[] {
    return productImages.map((v) => ({
      url: v.url,
    }));
  }

  private static _mapProductTagsData(
    productTags: ProductTagVo[],
  ): ProductTagData[] {
    return productTags.map((v) => ({
      tagId: v.tagId,
    }));
  }
}
