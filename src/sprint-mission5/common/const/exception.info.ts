export const EXCEPTIONS = {
  // 요청 형식 오류
  INVALID_REQUEST: {
    statusCode: 400,
  },
  USERID_FORM: {
    statusCode: 400,
    message: "userId 양식에 안 맞습니다.",
  },
  REFRESHTOKEN_FORM: {
    statusCode: 400,
    message: "refresh 토큰 양식에 안 맞습니다.",
  },
  EMAIL_FORM: {
    statusCode: 400,
    message: "이메일 양식에 안 맞습니다.",
  },
  NICKNAME_FORM: {
    statusCode: 400,
    message: "닉네임 양식에 안 맞습니다.",
  },
  IMAGE_FORM: {
    statusCode: 400,
    message: "이미지 양식에 안 맞습니다.",
  },
  PASSWORD_FORM: {
    statusCode: 400,
    message: "비밀번호 양식에 안 맞습니다.",
  },
  UPDATEPASSWORD_FORM: {
    statusCode: 400,
    message: "수정 비밀번호 양식에 안 맞습니다.",
  },
  NAME_FORM: {
    statusCode: 400,
    message: "이름 양식에 안 맞습니다.",
  },
  DESCRIPTION_FORM: {
    statusCode: 400,
    message: "설명 양식에 안 맞습니다.",
  },
  PRICE_FORM: {
    statusCode: 400,
    message: "가격 양식에 안 맞습니다.",
  },
  TAGS_FORM: {
    statusCode: 400,
    message: "태그 양식에 안 맞습니다.",
  },
  OFFSET_FORM: {
    statusCode: 400,
    message: "offset 양식에 안 맞습니다.",
  },
  LIMIT_FORM: {
    statusCode: 400,
    message: "limit 양식이 안 맞습니다.",
  },
  CURSOR_FORM: {
    statusCode: 400,
    message: "it 양식이 안 맞습니다.",
  },
  NAME_TOO_LONG: {
    statusCode: 422,
    message: "이름의 최대 길이는 20글자입니다.",
  },
  DESCRIPTION_TOO_SHORT: {
    statusCode: 422,
    message: "설명이 너무 짧습니다.(최소 6글자)",
  },
  PRICE_NOT_NEGATIVE_NUMBER: {
    statusCode: 422,
    message: "숫자는 양의 정수만 가능합니다.",
  },
  LEAST_ONE_TAG: {
    statusCode: 422,
    message: "최소 1개 이상 넣어야 합니다.",
  },
  SORT_FORM: {
    statusCode: 400,
    message: "정렬 양식이 안 맞습니다.",
  },
  LIMIT_MAX_20: {
    statusCode: 422,
    message: "limit 최대치는 20입니다.",
  },
  LIMIT_OVERFLOW: {
    statusCode: 422,
    message:
      "요청한 limit 값이 전체 데이터 개수(${value})를 초과했습니다.",
  },
  TITLE_TOO_LONG: {
    statusCode: 422,
    message: "제목의 최대 길이는 20글자입니다.",
  },
  CONTENT_TOO_SHORT: {
    statusCode: 422,
    message: "내용이 너무 짧습니다.(최소 6글자)",
  },
  PASSWORD_MISMATCH: {
    statusCode: 401,
    message: "비밀번호가 일치하지 않습니다.",
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    message: "토큰이 만료됐습니다.",
  },
  INVALID_AUTH: {
    statusCode: 401,
    message: "인증이 유효하지 않습니다.",
  },
  REFRESHTOKEN_MISMATCH: {
    statusCode: 404,
    message: "refresh 토큰이 일치하지 않습니다.",
  },
  EMAIL_TOO_SHORT: {
    statusCode: 404,
    message: "이메일이 너무 짧습니다.",
  },
  PASSWORD_TOO_SHORT: {
    statusCode: 404,
    message: "비밀번호가 너무 짧습니다.",
  },
  NICKNAME_TOO_LONG: {
    statusCode: 404,
    message: "닉네임이 너무 깁니다.",
  },

  // 필수 값 누락
  NAME_NOT_EXIST: {
    statusCode: 400,
    message: "이름은 입력하지 않았습니다.(필수)",
  },
  DESCRIPTION_NOT_EXIST: {
    statusCode: 400,
    message: "설명을 입력하지 않았습니다.(필수)",
  },
  PRICE_NOT_EXIST: {
    statusCode: 400,
    message: "가격은 입력하지 않았습니다.(필수)",
  },
  TAGS_NOT_EXIST: {
    statusCode: 400,
    message: "태그를 입력하지 않았습니다.(필수)",
  },
  TITLE_NOT_EXIST: {
    statusCode: 404,
    message: "제목이 존재하지 않습니다.",
  },
  CONTENT_NOT_EXIST: {
    statusCode: 404,
    message: "내용이 존재하지 않습니다.",
  },
  ARTICLE_NOT_EXIST: {
    statusCode: 404,
    message: "게시글이 존재하지 않습니다.",
  },
  COMMENT_NOT_EXIST: {
    statusCode: 404,
    message: "댓글이 존재하지 않습니다.",
  },
  PRODUCT_NOT_EXIST: {
    statusCode: 404,
    message: "상품이 존재하지 않습니다.",
  },
  LIKE_NOT_EXIST: {
    statusCode: 404,
    message: "이미 좋아요가 안 눌러져 있습니다.",
  },
  LIKE_EXIST: {
    statusCode: 404,
    message: "이미 좋아요가 눌러져 있습니다.",
  },
  ID_NOT_EXIST: {
    statusCode: 404,
    message: "id가 존재하지 않습니다.",
  },
  TARGETTYPE_NOT_EXIST: {
    statusCode: 404,
    message: "타겟 타입이 존재하지 않습니다.",
  },
  USER_NOT_EXIST: {
    statusCode: 404,
    message: "유저가 존재하지 않습니다.",
  },
  USER_PRODUCTS_NOT_EXIST: {
    statusCode: 404,
    message: "유저의 상품이 존재하지 않습니다.",
  },
  USER_LIKEPRODUCTS_NOT_EXIST: {
    statusCode: 404,
    message: "유저의 좋아요 상품이 존재하지 않습니다.",
  },
  USER_LIKEARTICLES_NOT_EXIST: {
    statusCode: 404,
    message: "유저의 좋아요 게시글이 존재하지 않습니다.",
  },
  REFRESHTOKEN_NOT_EXIST: {
    statusCode: 404,
    message: "refresh 토큰이 존재하지 않습니다.",
  },
  USERID_NOT_EXIST: {
    statusCode: 404,
    message: "userId가 없습니다.",
  },

  // 중복/충돌
  PRODUCT_ALREADY_EXIST: {
    statusCode: 409,
    message: "이미 상품이 존재합니다.",
  },
  ARTICLE_ALREADY_EXIST: {
    statusCode: 409,
    message: "이미 게시글이 존재합니다.",
  },
  COMMENT_ALREADY_EXIST: {
    statusCode: 409,
    message: "이미 댓글이 존재합니다.",
  },
  EMAIL_DUPLICATE: {
    statusCode: 409,
    message: "중복된 이름입니다.",
  },
  FOREIGN_KEY_VIOLATION: {
    statusCode: 422,
    message: "존재하지 않은 외래키입니다.",
  },
  USER_EXIST: {
    statusCode: 409,
    message: "이미 유저가 존재합니다.",
  },

  // 형식 오류 및 기타
  ID_FORM: {
    statusCode: 400,
    message: "id 양식이 안 맞습니다.",
  },
  PRODUCTID_FORM: {
    statusCode: 400,
    message: "productId 양식이 안 맞습니다.",
  },
  ARTICLEID_FORM: {
    statusCode: 400,
    message: "articleId 양식이 안 맞습니다.",
  },
  COMMENTID_FORM: {
    statusCode: 400,
    message: "commentId 양식이 안 맞습니다.",
  },
  TARGETTYPE_FORM: {
    statusCode: 400,
    message: "타겟 타입 양식이 안 맞습니다.",
  },
  AT_LEAST_ONE_FORM: {
    statusCode: 400,
    message: "최소 하나 양식을 입력해야 됩니다.",
  },
  TITLE_FORM: {
    statusCode: 400,
    message: "제목 양식이 안 맞습니다.",
  },
  CONTENT_FORM: {
    statusCode: 400,
    message: "내용 양식이 안 맞습니다.",
  },
  UNAUTHORIZED_PRODUCT_OWNER: {
    statusCode: 403,
    message: "해당 상품에 대한 권한이 없습니다.",
  },
  UNAUTHORIZED_ARTICLE_OWNER: {
    statusCode: 403,
    message: "해당 게시글에 대한 권한이 없습니다.",
  },
  UNAUTHORIZED_COMMENT_OWNER: {
    statusCode: 403,
    message: "해당 댓글에 대한 권한이 없습니다.",
  },
};