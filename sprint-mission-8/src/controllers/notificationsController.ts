import { Request, Response } from "express";
import {create} from 'superstruct';
import { IdParamsStruct } from "../structs/commonStructs";
import { readNotificationById } from "../services/notificationsService";

export const readNotification = async (req: Request, res: Response) => {
  const {id} = create(req.params, IdParamsStruct);
  await readNotificationById(req.user?.id, id);
  res.status(200).send();
}