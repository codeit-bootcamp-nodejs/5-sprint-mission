import { NewTagEntity, PersistTagEntity } from "../../entity/tag.entity";

export interface ITagRepo {
  findOrCreateTags(entities: NewTagEntity[]): Promise<PersistTagEntity[]>;
}