import {
  boolean,
  coerce,
  defaulted,
  object,
  optional,
  string,
  integer,
} from "superstruct";

const integerString = coerce(integer(), string(), (value) => parseInt(value));
const booleanish = coerce(
  boolean(),
  string(),
  (value) => value === "true" || value === "1",
);

export const NotificationListQueryStruct = object({
  take: defaulted(integerString, 20),
  cursor: optional(integerString),
  unreadOnly: defaulted(booleanish, false),
});
