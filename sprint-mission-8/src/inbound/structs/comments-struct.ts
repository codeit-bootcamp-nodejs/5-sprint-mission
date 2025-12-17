import { nonempty, object, partial, string } from "superstruct";
import { CursorParamsStruct } from "./common-structs";

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
});

export const UpdateCommentBodyStruct = object({
  content: nonempty(string()),
});

export const GetCommentListParamsStruct = CursorParamsStruct;
