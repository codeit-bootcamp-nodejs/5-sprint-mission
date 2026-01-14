import { NewTagEntity, PersistTagEntity } from "../../../command/entity/tag.entity";

export interface ITagCommandRepo {
  findOrCreateTags(entities: NewTagEntity[]): Promise<PersistTagEntity[]>;
}
