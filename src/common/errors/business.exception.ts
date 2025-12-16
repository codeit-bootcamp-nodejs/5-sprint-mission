export enum BusinessExceptionType {
  TOKEN_EXPIRED,
  UNKOWN_SERVER_ERROR,
  EMAIL_REQUIRE,
  INVALIDE_EMAIL,
  PASSWORD_REQUIRED,
  EMAIL_DUPLICATE,
  NICKNAME_TOO_LONG,
  PASSWORD_TOO_SHORT,
  INVALID_AUTH,
  UNAUTORIZED_REQUEST,
  TOO_MANY_POST,
  CONTENT_TOO_LONG,
  PARSE_BODY_ERROR,
  USER_NOT_FOUND,
  ARTICLE_NOT_FOUND,
  NICKNAME_DUPLICATE,
  INVALID_PASSWORD,
  ALREADY_LIKED,
  PRODUCT_NOT_FOUND,
  COMMENT_NOT_FOUND,
  TITLE_REQUIRED,
  CONTENT_REQUIRED,
  TITLE_TOO_LONG,
  INVALID_PAGE_PARAMS,
  UNAUTHORIZED_MODIFICATION,
  NOTIFICATION_NOT_FOUND,
}

const BusinessExceptionTable: Record<
  BusinessExceptionType,
  { statusCode: number; message: string }
> = {
  [BusinessExceptionType.ALREADY_LIKED]: {
    statusCode: 400,
    message: "이미 좋아요를 눌렀어요.",
  },
  [BusinessExceptionType.INVALID_PASSWORD]: {
    statusCode: 401,
    message: "비밀 번호가 일치하지 않습니다",
  },
  [BusinessExceptionType.NICKNAME_DUPLICATE]: {
    statusCode: 409,
    message: "이미 존재하는 닉네임이에요.",
  },
  [BusinessExceptionType.TOKEN_EXPIRED]: {
    statusCode: 401,
    message: "토큰이 만료되었습니다",
  },
  [BusinessExceptionType.UNKOWN_SERVER_ERROR]: {
    statusCode: 500,
    message: "알 수 없는 서버 에러입니다.",
  },
  [BusinessExceptionType.EMAIL_REQUIRE]: {
    statusCode: 400,
    message: "이메일을 입력해주세요.",
  },
  [BusinessExceptionType.INVALIDE_EMAIL]: {
    statusCode: 400,
    message: "이메일 형식이 올바르지 않습니다.",
  },
  [BusinessExceptionType.PASSWORD_REQUIRED]: {
    statusCode: 400,
    message: "비밀번호를 입력해주세요.",
  },
  [BusinessExceptionType.EMAIL_DUPLICATE]: {
    statusCode: 409,
    message: "이미 존재하는 이메일이에요.",
  },
  [BusinessExceptionType.NICKNAME_TOO_LONG]: {
    statusCode: 400,
    message: "닉네임은 최대 20자까지 가능해요.",
  },
  [BusinessExceptionType.PASSWORD_TOO_SHORT]: {
    statusCode: 400,
    message: "비밀번호는 최소 8자 이상이어야 해요.",
  },
  [BusinessExceptionType.INVALID_AUTH]: {
    statusCode: 400,
    message: "이메일 또는 비밀번호가 일치하지 않아요.",
  },
  [BusinessExceptionType.UNAUTORIZED_REQUEST]: {
    statusCode: 403,
    message: "권한이 없어요.",
  },
  [BusinessExceptionType.TOO_MANY_POST]: {
    statusCode: 429,
    message: "너무 많은 요청입니다. 잠시 후에 다시 시도해주세요.",
  },
  [BusinessExceptionType.CONTENT_TOO_LONG]: {
    statusCode: 400,
    message: "내용이 너무 깁니다.",
  },
  [BusinessExceptionType.PARSE_BODY_ERROR]: {
    statusCode: 400,
    message: "요청 본문을 파싱할 수 없습니다.",
  },
  [BusinessExceptionType.USER_NOT_FOUND]: {
    statusCode: 404,
    message: "사용자를 찾을 수 없습니다.",
  },
  [BusinessExceptionType.ARTICLE_NOT_FOUND]: {
    statusCode: 404,
    message: "게시글을 찾을 수 없습니다.",
  },
  [BusinessExceptionType.PRODUCT_NOT_FOUND]: {
    statusCode: 404,
    message: "상품을 찾을 수 없습니다.",
  },
  [BusinessExceptionType.COMMENT_NOT_FOUND]: {
    statusCode: 404,
    message: "댓글을 찾을 수 없습니다.",
  },
  [BusinessExceptionType.TITLE_REQUIRED]: {
    statusCode: 400,
    message: "제목은 필수입니다.",
  },
  [BusinessExceptionType.CONTENT_REQUIRED]: {
    statusCode: 400,
    message: "내용은 필수입니다.",
  },
  [BusinessExceptionType.TITLE_TOO_LONG]: {
    statusCode: 400,
    message: "제목은 255자 이내여야 합니다.",
  },
  [BusinessExceptionType.INVALID_PAGE_PARAMS]: {
    statusCode: 400,
    message:
      "페이지 번호는 1 이상이고, 페이지 크기는 1 이상 100 이하여야 합니다.",
  },
  [BusinessExceptionType.UNAUTHORIZED_MODIFICATION]: {
    statusCode: 403,
    message: "수정할 권한이 없습니다.",
  },
  [BusinessExceptionType.NOTIFICATION_NOT_FOUND]: {
    statusCode: 404,
    message: "알림을 찾을 수 없습니다.",
  },
};

export class BusinessException extends Error {
  public readonly statusCode: number;
  public readonly type: BusinessExceptionType;
  public readonly error?: Error;

  constructor(options: {
    message?: string;
    type: BusinessExceptionType;
    error?: Error;
  }) {
    super(options.message ?? BusinessExceptionTable[options.type].message);
    this.statusCode = BusinessExceptionTable[options.type].statusCode;
    this.type = options.type;
    this.error = options.error;
  }
}
