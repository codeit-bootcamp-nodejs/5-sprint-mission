import * as s from "superstruct";

const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const IdParamsStruct = object({
  id: integerString,
});

//페이지 조건 검사 맞는지 확인
export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  orderBy: optional(enums(["recent"])),
  keyword: optional(nonempty(string())),
});

export const CursorParamsStruct = object({
  cursor: defaulted(integerString, 0),
  limit: defaulted(integerString, 10),
  orderBy: optional(enums(["recent"])),
  keyword: optional(nonempty(string())),
});
