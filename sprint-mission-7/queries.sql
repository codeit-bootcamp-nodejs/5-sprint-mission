/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE User
SET nickname = 'test'
WHERE id = '1';


/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM Product
WHERE userId = '1'
ORDER BY createdAt DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total
FROM Product
WHERE userId = '1';


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM Product
WHERE userId = '1'
  AND isLiked = TRUE
ORDER BY createdAt DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS liked_total
FROM Product
WHERE userId = '1'
  AND isLiked = TRUE;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO Product (
  id, userId, name, description, price, tags, imageUrl, isLiked, createdAt, updatedAt
)
VALUES (
  'p1', '1', '신상품', '새로 진열된 상품입니다', 50000,
  ARRAY['신상', '전자기기'], 'http://example-image.com',
  FALSE, NOW(), NOW()
);


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT 
  p.*,
  (CASE WHEN p.isLiked = TRUE THEN 1 ELSE 0 END) AS like_count
FROM Product p
WHERE p.name LIKE '%test%'
ORDER BY p.createdAt DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT *
FROM Product
WHERE id = '1';


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE Product
SET name = '변경된 상품',
    updatedAt = NOW()
WHERE id = '1';


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM Product
WHERE id = '1';


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
UPDATE Product
SET isLiked = TRUE
WHERE id = '2';


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
UPDATE Product
SET isLiked = FALSE
WHERE id = '2';


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO ProductComment (id, productId, content, createdAt, updatedAt, userId)
VALUES ('pc1', '2', '너무 갖고 싶습니다..', NOW(), NOW(), '1');


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT *
FROM ProductComment
WHERE productId = '1'
  AND createdAt < '2025-03-25'
ORDER BY createdAt DESC
LIMIT 10;
