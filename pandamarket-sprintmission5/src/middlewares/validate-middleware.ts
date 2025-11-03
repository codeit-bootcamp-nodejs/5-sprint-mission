import { assert } from "superstruct";
import { Exception } from "../utils/exception.js";

export const validate = (struct) => (req, res, next) => {
  try {
    assert(req.body, struct);
    next();
  } catch (err) {
    const message = err?.message || "입력값이 유효하지 않습니다";
    throw new Exception(400, message);
  }
};
