import * as s from "superstruct";

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = s.object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: nonempty(string()),
  image: nullable(string()),
});

export const UpdateArticleBodyStruct = s.partial(CreateArticleBodyStruct);
