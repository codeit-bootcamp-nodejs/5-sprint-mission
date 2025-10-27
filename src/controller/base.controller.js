import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import NotFoundError from "../lib/errors/NotFoundError.js";
import { IdParamsStruct } from "../structs/commonStructs.js";

export class BaseController {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  async create(req, res, createStruct) {
    const data = create(req.body, createStruct);
    const entity = await this.model.create({ data });
    return res.status(201).send(entity);
  }

  async getById(req, res) {
    const { id } = create(req.params, IdParamsStruct);
    const entity = await this.model.findUnique({ where: { id } });

    if (!entity) {
      throw new NotFoundError(this.modelName, id);
    }

    return res.send(entity);
  }

  async update(req, res, updateStruct) {
    const { id } = create(req.params, IdParamsStruct);
    const data = create(req.body, updateStruct);

    const existingEntity = await this.model.findUnique({ where: { id } });
    if (!existingEntity) {
      throw new NotFoundError(this.modelName, id);
    }

    const updatedEntity = await this.model.update({ where: { id }, data });
    return res.send(updatedEntity);
  }

  async delete(req, res) {
    const { id } = create(req.params, IdParamsStruct);

    const existingEntity = await this.model.findUnique({ where: { id } });
    if (!existingEntity) {
      throw new NotFoundError(this.modelName, id);
    }

    await this.model.delete({ where: { id } });
    return res.status(204).send();
  }

  async getList(req, res, paramsStruct, searchFields = []) {
    const { page, pageSize, orderBy, keyword } = create(
      req.query,
      paramsStruct
    );

    const where =
      keyword && searchFields.length > 0
        ? {
            OR: searchFields.map((field) => ({
              [field]: { contains: keyword },
            })),
          }
        : undefined;

    const totalCount = await this.model.count({ where });
    const entities = await this.model.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
      where,
    });

    return res.send({
      list: entities,
      totalCount,
    });
  }
}
