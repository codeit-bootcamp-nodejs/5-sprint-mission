import { nullable, object, partial, string } from "superstruct";
import { PageParamsStruct } from "./common-structs";

export const UpdateMeBodyStruct = partial(
  object({
    email: string(),
    nickname: string(),
    image: nullable(string()),
  }),
);

export const UpdatePasswordBodyStruct = object({
  password: string(),
  newPassword: string(),
});

export const GetMyProductListParamsStruct = PageParamsStruct;

export const GetMyFavoriteListParamsStruct = PageParamsStruct;
