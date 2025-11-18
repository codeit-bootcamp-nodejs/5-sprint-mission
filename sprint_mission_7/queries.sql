/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/

UPDATE users
SET nickname = 'test', updated_at = NOW()
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT *
FROM products
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/

SELECT COUNT(*) AS total_products
FROM products
WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT p.*
FROM 
  products p
  JOIN likes l 
  ON l.target_id = p.id
WHERE 
  l.user_id = 1
  AND 
  l.target_type = 'product'
ORDER BY l.created_at DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/

SELECT COUNT(*) AS total_liked_products
FROM 
  likes AS l
  JOIN products AS p 
  ON l.target_id = p.id
WHERE l.user_id = 1
  AND l.target_type = 'product';

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/

INSERT INTO products (user_id, title, description, price, image_url)
VALUES (1, '에어프라이기', '하자 없습니다.', 80000, 'https://example.com/image1.jpg');

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/

SELECT 
  p.*, 
  COUNT(l.id) AS total_likes
FROM 
  products AS p 
  LEFT JOIN 
  likes AS l 
  ON l.target_type = 'product' 
  AND l.target_id = p.id
WHERE 
  p.title LIKE '%test%'
GROUP BY 
  p.id
ORDER BY 
  p.created_at DESC
LIMIT 10 OFFSET 0;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/

SELECT 
  p.*, 
  u.nickname AS seller_name, 
  COUNT(l.id) AS like_count
FROM 
  products AS p
  JOIN users AS u 
  ON p.user_id = u.id
  LEFT JOIN likes AS l ON l.target_type = 'product' AND l.target_id = p.id
WHERE p.id = 1
GROUP BY p.id;

/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/

UPDATE products
SET title = '아이폰 15',
    description = '액정 나가긴했음.',
    price = 700000,
    updated_at = NOW()
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/

DELETE FROM products
WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/

INSERT INTO likes (user_id, target_type, target_id)
VALUES (1, 'product', 2);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/

DELETE FROM likes
WHERE user_id = 1
  AND target_type = 'product'
  AND target_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/

INSERT INTO product_inquiries(product_id, user_id, content)
VALUES(2, 1, '네고 가능한가요?');

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/

SELECT pi.*, u.nickname
FROM 
  product_inquiries AS pi
  LEFT JOIN users AS u 
  ON pi.user_id = u.id
WHERE 
  pi.product_id = 1
  AND 
  pi.created_at < '2025-03-25'
ORDER BY pi.created_at DESC
LIMIT 10;

