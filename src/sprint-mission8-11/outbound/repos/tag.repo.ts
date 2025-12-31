import { NewTagEntity, PersistTagEntity } from "../../domain/entity/tag.entity";
import { ITagRepo } from "../../domain/port/repo/tag.repo.interface";
import { TagMapper } from "../mapper/tag.mapper";
import { BaseRepo } from "./base.repo";

/**
 * 새로운 태크만 생성하고 기존 태그는 유지, 삭제 x
 */
export class TagRepo extends BaseRepo implements ITagRepo {
  async findOrCreateTags(
    entities: NewTagEntity[],
  ): Promise<PersistTagEntity[]> {
    await this._prisma.tag.createMany({
      data: entities.map((v) => {
        return { name: v.name };
      }),
      skipDuplicates: true,
    });

    const foundTags = await this._prisma.tag.findMany({
      where: {
        name: { in: entities.map((v) => v.name) },
      },
    });

    return foundTags.map((tag) => TagMapper.toPersistEntity(tag));
  }
}
