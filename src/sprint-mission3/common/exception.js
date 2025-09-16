export const EXCEPTIONS = {
  NAME_FORM: {
    statusCode: 400,
    message: "이름 양식에 안 맞습니다.",
  },
  NAME_NOT_EXSIST:{
    statusCode: 400,
    message: "이름은 입력하지 않았습니다.(필수)",
  },
  DESCRIPTION_FORM: {
    statusCode: 400,
    message: "설명 양식에 안 맞습니다.",
  },
  DESCRIPTION_NOT_EXSIST:{
    statusCode: 400,
    message: "설명을 입력하지 않았습니다.(필수)",
  },
  PRICE_FORM: {
    statusCode: 400,
    message: "가격 양식에 안 맞습니다.",
  },
  PRICE_NOT_EXSIST:{
    statusCode: 400,
    message: "가격은 입력하지 않았습니다.(필수)",
  },
  TAGS_FORM: {
    statusCode: 400,
    message: "태크 양식에 안 맞습니다.",
  },
  TAGS_NOT_EXSIST:{
    statusCode: 400,
    message: "태그를 입력하지 않았습니다.(필수)",
  },
  OFFSET_FORM: {
    statusCode: 400,
    message: "offset 양식에 안 맞습니다.",
  },
  LIMIT_FORM: {
    statusCode: 400,
    message: "limit 양식에 안 맞거나 입력하지 않았습니다.",
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
  PRODUCT_ALREADY_EXIST: {
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
  },
  PRODUCT_NOT_EXIST:{
    statusCode: 400,
    message: "상품이 존재하지 않습니다."
  },
  ID_NOT_EXSIST:{
    statusCode: 400,
    message: "id를 입력하세요.(필수)"
  },
  ID_FORM:{
    statusCode: 400,
    message: "id 양식이 안 맞습니다."
  },
  SORT_FORM:{
    statusCode: 400,
    message: "정렬 양식이 안 맞습니다."
  },
  LIMIT_MAX_20: {
    statusCode: 400,
    message: "limit 최대치는 20입니다."
  },
  LIMIT_OVERFLOW: {
    statusCode: 400,
    message: '요청한 limit 값이 전체 데이터 개수(${totalCount})를 초과했습니다.'
  },
  TITLE_FORM: {
    statusCode: 400,
    message: "제목 양식이 안 맞습니다."
  },
  CONTENT_FORM: {
    statusCode: 400,
    message: "내용 양식이 안 맞습니다."
  },
  TITLE_NOT_EXSIST: {
    statusCode: 400,
    message: "제목이 존재하지 않습니다."
  },
  CONTENT_NOT_EXSIST: {
    statusCode: 400,
    message: "내용이 존재하지 않습니다."
  },
  AT_LEAST_ONE_FORM: {
    statusCode: 400,
    message: "최소 하나 양식을 입력해야 됩니다."
  },
  ARTICLE_NOT_EXIST:{
    statusCode: 400,
    message: "게시글이 존재하지 않습니다."
  },
  ARTICLE_ALREADY_EXIST: {
    statusCode: 400,
    message: "이미 게시글이 존재합니다.",
  },
  TITLE_TOO_LONG: {
    statusCode: 400,
    message: "제목의 최대 길이는 20글자입니다.",
  },
  CONTENT_TOO_SHORT: {
    statusCode: 400,
    message: "내용이 너무 짧습니다.(최소 6글자)",
  },
  COMMENT_ALREADY_EXIST: {
    statusCode: 400,
    message: "이미 댓글이 존재합니다.",
  },
  COMMENT_NOT_EXIST: {
    statusCode: 400,
    message: "댓글이 존재하지 않습니다.",
  },
  // FOREIGNID_FORM:{
  //   statusCode: 400,
  //   message: "외래키 양식이 안 맞습니다.",
  // },
  // FOREIGNID_NOT_EXSIST: {
  //   statusCode: 400,
  //   message: "외래키가 존재하지 않습니다.",
  // },
  TARGETTYPE_FORM:{
    statusCode: 400,
    message: "타겟 타입 양식이 안 맞습니다.",
  },
  TARGETTYPE_NOT_EXSIST: {
    statusCode: 400,
    message: "타겟 타입이 존재하지 않습니다.",
  }
};

export class Exception extends Error {
  constructor(key, data = {}) {
    const errInfo = EXCEPTIONS[key];
    let message = errInfo.message;
    if(data){
      for (const [k, v] of Object.entries(data)) {
        message = message.replace(new RegExp(`\\$\\{${k}\\}`, "g"), v);
      }
    }
    super(message);
    this.statusCode = errInfo.statusCode;
  }
}
