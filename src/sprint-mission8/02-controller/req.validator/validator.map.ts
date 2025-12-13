import { EXCEPTIONS } from "../../shared/const/exception.info";

export const fieldExceptionMap: Record<string, any> = {
  // 공통
  userId: EXCEPTIONS.USERID_FORM,
  commentId: EXCEPTIONS.COMMENTID_FORM,
  articleId: EXCEPTIONS.ARTICLEID_FORM,
  productId: EXCEPTIONS.PRODUCTID_FORM,

  // User
  email: EXCEPTIONS.EMAIL_FORM,
  password: EXCEPTIONS.PASSWORD_FORM,
  updatePassword: EXCEPTIONS.UPDATEPASSWORD_FORM,
  nickname: EXCEPTIONS.NICKNAME_FORM,
  image: EXCEPTIONS.IMAGE_FORM,
  refreshToken: EXCEPTIONS.REFRESHTOKEN_FORM,

  // Product
  name: EXCEPTIONS.NAME_FORM,
  description: EXCEPTIONS.DESCRIPTION_FORM,
  price: EXCEPTIONS.PRICE_FORM,
  tags: EXCEPTIONS.TAGS_FORM,

  // Article
  title: EXCEPTIONS.TITLE_FORM,
  content: EXCEPTIONS.CONTENT_FORM,
  
  //pagination
  offset: EXCEPTIONS.OFFSET_FORM,
  limit: EXCEPTIONS.LIMIT_FORM,
  sort: EXCEPTIONS.SORT_FORM,
  cursor: EXCEPTIONS.CURSOR_FORM,
};