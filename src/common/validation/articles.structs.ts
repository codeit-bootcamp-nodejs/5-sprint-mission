import {
  coerce,
  nonempty,
  nullable,
  object,
  partial,
  string,
} from "superstruct";
import { PageParamsStruct } from "./common.structs";

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: nonempty(string()),
  image: nullable(string()),
});

export const UpdateArticleBodyStruct = partial(CreateArticleBodyStruct);
