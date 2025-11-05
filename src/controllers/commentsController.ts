import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient";
import { UpdateCommentBodyStruct } from "../structs/commentsStruct";
import NotFoundError from "../lib/errors/NotFoundError";
import { IdParamsStruct } from "../structs/commonStructs";
import { AuthenticatedHandler } from "../types/common";

export const updateComment: AuthenticatedHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const userId = req.user?.userId;

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }
  if (existingComment.userId !== userId) {
    res
      .status(403)
      .send({ message: "댓글을 등록한 사용자만 수정할 수 있습니다." });
    return;
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  res.send(updatedComment);
};

export async function deleteComment(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }
  if (existingComment.userId !== userId) {
    res
      .status(403)
      .send({ message: "댓글을 등록한 사용자만 삭제할 수 있습니다." });
    return;
  }

  await prismaClient.comment.delete({ where: { id } });
  res.status(204).send();
}
