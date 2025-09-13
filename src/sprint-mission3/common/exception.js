export const EXCEPTIONS = {
  NAME_FORM: {
    statusCode: 400,
    message: "이름 양식에 안 맞거나 입력하지 않았습니다.",
  },
  DESCRIPTION_FORM: {
    statusCode: 400,
    message: "설명 양식에 안 맞거나 입력하지 않았습니다.",
  },
  PRICE_FORM: {
    statusCode: 400,
    message: "가격 양식에 안 맞거나 입력하지 않았습니다.",
  },
  TAGS_FORM: {
    statusCode: 400,
    message: "태크 양식에 안 맞거나 입력하지 않았습니다.",
  },
  NAME_TOO_LONG: {
    statusCode: 400,
    message: "이름의 최대 길이는 20글자입니다.",
  },
  DESCRIPTION_TOO_SHORT: {
    statusCode: 400,
    message: "설명이 너무 짧습니다.(최소 6글자)",
  },
  PRICE_NOT_NEGATIVE_NUMBER: {
    statusCode: 400,
    message: "숫자는 양의 정수만 가능합니다.",
  },
  LEAST_ONE_TAG: {
    statusCode: 400,
    message: "최소 1개 이상 넣어야 합니다.",
  },
  NAME_ALREADY_EXIST: {
    statusCode: 400,
    message: "이미 상품이 존재합니다.",
  },
  EMAIL_DUPLICATE:{
    statusCode: 400,
    message: "중복된 이름입니다.",
  },
  FOREIGN_KEY_VIOLATION:{
    statusCode: 400,
    message: "존재하지 않은 외래키입니다."
  }
};

export class Exception extends Error {
  constructor(key) {
    const errInfo = EXCEPTIONS[key];
    super(errInfo.message);
    this.statusCode = errInfo.statusCode;
  }
}
