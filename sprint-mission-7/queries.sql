/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
  UPDATE user
  SET nickname = 'test'
  where id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
  SELECT *
  FROM product
  WHERE user_id = 1
  ORDER BY created_at DESC
  LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
  SELECT COUNT(*) AS total
  FROM product
  WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
  SELECT P.*
  FROM product_like AS PL
    JOIN product AS P
    ON PL.product_id = P.id
  WHERE PL.user_id = 1;
  ORDER BY P.created_at DESC
  LIMIT 10 OFFSET 20;

/*

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
  SELECT COUNT(*) AS total
  FROM product_like
  WHERE user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO product (title, description, price, image_url, user_id)
VALUES ('맥북m1', '아이맥 사서 팔아요', 500000, 'https://pandamarket.com/images/image1.jpg', 1);

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT P.* , COUNT(PL.product_id) as 'like'
FROM product AS P
    LEFT JOIN product_like AS PL
    ON PL.product_id = P.id
WHERE P.title LIKE '%test%'
GROUP BY P.id
ORDER BY P.created_at DESC
LIMIT 10 OFFSET 0;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT 
  P.*,
  U.nickname,
  PT.product_tag
FROM product AS P
  JOIN user AS U ON P.id = user.product_id
  LEFT JOIN product_tag AS PT ON P.id = PT.product_id
WHERE P.id = 1;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE product
SET title = '이케아 조명',
  description = '저희 집이랑 안어울리네요',
  price = 20000
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM product
WHERE id = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_like (user_id, product_id)
VALUES (1, 2);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_like
WHERE user_id = 1 
  AND product_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO product_comment (comment, user_id, product_id)
VALUES ('오!', 1, 2);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT *
FROM product_comment
WHERE product_id = 1
  AND created_at < '2025-03-25'
ORDER BY created_at DESC
