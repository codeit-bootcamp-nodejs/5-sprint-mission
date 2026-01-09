import { Tag } from "@prisma/client";
import { NewTagEntity, PersistTagEntity, TagEntity } from "../../application/command/entity/tag.entity";

export type CreateTagData = {
  name: string;
};

export class TagMapper {
  static toCreateData(entity: NewTagEntity): CreateTagData {
    return {
      name: entity.name,
    };
  }

  static toPersistEntity(tag: Tag): PersistTagEntity {
    return TagEntity.createPersist({
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
    });
  }
}
